import { Module } from '@nestjs/common'
import { ArticleService } from './article.service'
import { ArticleController } from './article.controller'
import { AuthUser } from '@pengode/auth/utils/auth-user'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Article } from '@pengode/article/article'

@Module({
  imports: [TypeOrmModule.forFeature([Article])],
  providers: [AuthUser, ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
