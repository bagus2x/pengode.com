import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { AuthUser } from '@pengode/auth/utils/auth-user'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Article } from '@pengode/article/article'
import { ArticleService } from '@pengode/article/article.service'
import { ArticleController } from '@pengode/article/article.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Article]), ScheduleModule.forRoot()],
  providers: [AuthUser, ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
