import { Module } from '@nestjs/common'
import { ArticleHistoryService } from './article-history.service'
import { ArticleHistoryController } from './article-history.controller'

@Module({
  controllers: [ArticleHistoryController],
  providers: [ArticleHistoryService],
})
export class ArticleHistoryModule {}
