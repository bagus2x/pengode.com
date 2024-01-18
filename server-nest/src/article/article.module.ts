import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { TypeOrmModule } from '@nestjs/typeorm'
import { Article } from '@pengode/article/article'
import { ArticleController } from '@pengode/article/article.controller'
import { ArticleService } from '@pengode/article/article.service'

@Module({
  imports: [TypeOrmModule.forFeature([Article]), ScheduleModule.forRoot()],
  providers: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
