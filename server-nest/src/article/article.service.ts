import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { CronJob } from 'cron'
import { DataSource, In, LessThan, MoreThan, Raw, Repository } from 'typeorm'

import { ArticleCategory } from '@pengode/article-category/article-category'
import { ArticleHistory } from '@pengode/article-history/article-history'
import { Article, Status } from '@pengode/article/article'
import {
  ArticleResponse,
  CreateArticleRequest,
  FindAllRequest,
  ScheduleArticleRequest,
  UpdateArticleRequest,
} from '@pengode/article/article.dto'
import { PageResponse } from '@pengode/common/dtos'
import { User } from '@pengode/user/user'
import { ClsService } from 'nestjs-cls'

@Injectable()
export class ArticleService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly scheduleRegistry: SchedulerRegistry,
    private readonly clsService: ClsService,
  ) {}

  async create(req: CreateArticleRequest): Promise<ArticleResponse> {
    const article = await this.dataSource.manager.transaction(
      async (entityManager) => {
        const articleRepository = entityManager.getRepository(Article)
        const userRepository = entityManager.getRepository(User)
        const articleHistoryRepository =
          entityManager.getRepository(ArticleHistory)
        const articleCategoryRepository =
          entityManager.getRepository(ArticleCategory)

        const authorId = this.clsService.get('userId')
        const author = await userRepository.findOneBy({ id: authorId })
        if (!author) {
          throw new NotFoundException('author is not found')
        }

        const findCategory = (categoryId: number) => {
          const category = articleCategoryRepository.findOneBy({
            id: categoryId,
          })
          if (!category) {
            throw new NotFoundException('category is not found')
          }

          return category
        }

        const categories = await Promise.all(req.categoryIds.map(findCategory))

        const article = await articleRepository.save({
          title: req.title,
          thumbnail: req.thumbnailUrl,
          body: req.body,
          summary: req.summary,
          readingTime: req.readingTime,
          status: Status.DRAFT,
          author,
          categories,
        })

        await articleHistoryRepository.save({
          editor: author,
          status: Status.DRAFT,
          article,
        })

        return article
      },
    )

    return ArticleResponse.create(article)
  }

  async findAll(req: FindAllRequest): Promise<PageResponse<ArticleResponse>> {
    const articles = await this.articleRepository.find({
      where: {
        id: req.previousCursor
          ? MoreThan(req.previousCursor)
          : LessThan(req.nextCursor),
        title: req.search
          ? Raw((alias) => `LOWER(${alias}) LIKE '%${req.search}%'`)
          : undefined,
        status: req.statuses ? In(req.statuses) : undefined,
      },
      take: req.size,
      order: {
        id: 'DESC',
      },
    })

    return {
      items: articles.map(ArticleResponse.create),
      previousCursor: articles[0]?.id || 0,
      nextCursor: articles[articles.length - 1]?.id || 0,
    }
  }

  async findById(articleId: number): Promise<ArticleResponse> {
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
    })
    if (!article) {
      throw new NotFoundException('article is not found')
    }

    return ArticleResponse.create(article)
  }

  async update(
    articleId: number,
    req: UpdateArticleRequest,
  ): Promise<ArticleResponse> {
    const article = await this.dataSource.manager.transaction(
      async (entityManager) => {
        const articleRepository = entityManager.getRepository(Article)
        const articleCategoryRepository =
          entityManager.getRepository(ArticleCategory)

        const findCategory = (categoryId: number) => {
          const category = articleCategoryRepository.findOneBy({
            id: categoryId,
          })
          if (!category) {
            throw new NotFoundException('category is not found')
          }

          return category
        }

        const categories = await Promise.all(req.categoryIds.map(findCategory))

        const article = await articleRepository.findOneBy({ id: articleId })
        article.title = req.title
        article.thumbnailUrl = req.thumbnailUrl
        article.body = req.body
        article.summary = req.summary
        article.readingTime = req.readingTime
        article.categories = categories

        const updatedArticle = await articleRepository.save(article)

        return updatedArticle
      },
    )

    return ArticleResponse.create(article)
  }

  async draft(articleId: number) {
    const article = await this.dataSource.manager.transaction(
      async (entityManager) => {
        const articleRepository = entityManager.getRepository(Article)
        const userRepository = entityManager.getRepository(User)
        const articleHistoryRepository =
          entityManager.getRepository(ArticleHistory)

        const article = await articleRepository.findOne({
          where: { id: articleId },
        })
        if (!article) {
          throw new NotFoundException('article is not found')
        }
        if (article.status !== Status.PUBLISHED) {
          throw new BadRequestException(
            `Cannot draft article with status ${article.status}`,
          )
        }
        article.status = Status.DRAFT

        const draftedArticle = await articleRepository.save(article)

        const editorId = this.clsService.get('userId')
        const editor = await userRepository.findOneBy({ id: editorId })
        if (!editor) {
          throw new NotFoundException('editor is not found')
        }

        await articleHistoryRepository.save({
          editor,
          status: Status.DRAFT,
          article,
        })

        return draftedArticle
      },
    )

    return ArticleResponse.create(article)
  }

  async schedule(articleId: number, req: ScheduleArticleRequest) {
    const article = await this.dataSource.manager.transaction(
      async (entityManager) => {
        const articleRepository = entityManager.getRepository(Article)
        const userRepository = entityManager.getRepository(User)
        const articleHistoryRepository =
          entityManager.getRepository(ArticleHistory)

        const article = await articleRepository.findOne({
          where: { id: articleId },
        })
        if (!article) {
          throw new NotFoundException('article is not found')
        }
        if (
          article.status !== Status.DRAFT &&
          article.status !== Status.SCHEDULED
        ) {
          throw new BadRequestException(
            `Cannot schedule article with status ${article.status}`,
          )
        }

        article.status = Status.SCHEDULED
        article.scheduledAt = new Date(req.time)

        const scheduledArticle = await articleRepository.save(article)

        const editorId = this.clsService.get('userId')
        const editor = await userRepository.findOneBy({ id: editorId })
        if (!editor) {
          throw new NotFoundException('editor is not found')
        }

        await articleHistoryRepository.save({
          editor,
          status: Status.SCHEDULED,
          article,
        })

        const job = new CronJob(new Date(req.time), async () => {
          await this.publish(articleId)
        })

        this.scheduleRegistry.deleteCronJob(`${articleId}`)
        this.scheduleRegistry.addCronJob(`${articleId}`, job)
        job.start()

        return scheduledArticle
      },
    )

    return ArticleResponse.create(article)
  }

  async publish(articleId: number): Promise<ArticleResponse> {
    const article = await this.dataSource.manager.transaction(
      async (entityManager) => {
        const articleRepository = entityManager.getRepository(Article)
        const userRepository = entityManager.getRepository(User)
        const articleHistoryRepository =
          entityManager.getRepository(ArticleHistory)

        const article = await articleRepository.findOne({
          where: { id: articleId },
        })
        if (!article) {
          throw new NotFoundException('article is not found')
        }
        if (
          article.status !== Status.DRAFT &&
          article.status !== Status.SCHEDULED
        ) {
          throw new BadRequestException(
            `Cannot publish article with status ${article.status}`,
          )
        }

        console.log('HELLO')
        article.status = Status.PUBLISHED

        const publishedArticle = await articleRepository.save(article)

        const editorId = this.clsService.get('userId')
        const editor = await userRepository.findOneBy({ id: editorId })
        if (!editor) {
          throw new NotFoundException('editor is not found')
        }

        await articleHistoryRepository.save({
          editor,
          status: Status.PUBLISHED,
          article,
        })

        return publishedArticle
      },
    )

    return ArticleResponse.create(article)
  }

  async remove(articleId: number): Promise<ArticleResponse> {
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
    })

    await this.articleRepository.remove(article)

    return ArticleResponse.create(article)
  }
}
