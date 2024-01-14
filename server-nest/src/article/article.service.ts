import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, LessThan, Repository } from 'typeorm'

import { ArticleCategory } from '@pengode/article-category/article-category'
import { ArticleHistory } from '@pengode/article-history/article-history'
import { Article, Status } from '@pengode/article/article'
import {
  ArticleResponse,
  CreateArticleRequest,
  UpdateArticleRequest,
} from '@pengode/article/article.dto'
import { AuthUser } from '@pengode/auth/utils/auth-user'
import { PageRequest, PageResponse } from '@pengode/common/dtos'
import { User } from '@pengode/user/user'

@Injectable()
export class ArticleService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly authUser: AuthUser,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
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

        const authorId = this.authUser.user.userId
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
          thumbnail: req.thumbnail,
          body: req.body,
          summary: req.summary,
          readingTime: req.readingTime,
          status: Status.DRAFT,
          author,
          categories,
        })

        articleHistoryRepository.save({
          editor: author,
          status: Status.DRAFT,
          article,
        })

        return article
      },
    )

    return this.mapArticleToResponse(article)
  }

  async findAll(req: PageRequest): Promise<PageResponse<ArticleResponse>> {
    const articles = await this.articleRepository.find({
      where: { id: LessThan(req.cursor) },
      take: req.size,
    })

    return {
      items: articles.map(this.mapArticleToResponse),
      nextCursor: articles[articles.length - 1].id || 0,
    }
  }

  async findOne(articleId: number): Promise<ArticleResponse> {
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
      relations: { author: true, categories: true },
    })
    if (!article) {
      throw new NotFoundException('article is not found')
    }

    return this.mapArticleToResponse(article)
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
        article.thumbnail = req.thumbnail
        article.body = req.body
        article.summary = req.summary
        article.readingTime = req.readingTime
        article.categories = categories

        const updatedArticle = await articleRepository.save(article)

        return updatedArticle
      },
    )

    return this.mapArticleToResponse(article)
  }

  async remove(articleId: number): Promise<ArticleResponse> {
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
      relations: {
        author: true,
        categories: true,
      },
    })

    await this.articleRepository.remove(article)

    return this.mapArticleToResponse(article)
  }

  private mapArticleToResponse(article: Article): ArticleResponse {
    return {
      id: article.id,
      title: article.title,
      thumbnail: article.thumbnail,
      body: article.body,
      summary: article.summary,
      readingTime: article.readingTime,
      status: article.status,
      scheduledAt: article.scheduledAt,
      author: {
        id: article.author.id,
        email: article.author.email,
        username: article.author.username,
        name: article.author.name,
        photo: article.author.photo,
      },
      categories: article.categories.map((category) => ({
        id: category.id,
        name: category.name,
      })),
      histories: article.histories.map((history) => ({
        id: history.id,
        status: history.status,
        createdAt: history.createdAt,
      })),
    }
  }
}
