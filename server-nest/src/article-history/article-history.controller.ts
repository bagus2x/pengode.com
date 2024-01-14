import { Controller } from '@nestjs/common'
import { ArticleHistoryService } from './article-history.service'

@Controller('article-history')
export class ArticleHistoryController {
  constructor(private readonly articleHistoryService: ArticleHistoryService) {}
}
