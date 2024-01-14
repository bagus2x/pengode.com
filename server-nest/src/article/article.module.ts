import { Module } from '@nestjs/common'
import { ArticleService } from './article.service'
import { ArticleController } from './article.controller'
import { AuthUser } from '@pengode/auth/utils/auth-user'

@Module({
  providers: [AuthUser, ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
