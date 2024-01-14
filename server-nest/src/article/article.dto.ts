import { ApiProperty } from '@nestjs/swagger'
import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  NotEquals,
} from 'class-validator'

export class CreateArticleRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty()
  title: string

  @IsString()
  @MaxLength(511)
  @IsOptional()
  @ApiProperty()
  thumbnail?: string | null

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  body: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(511)
  @ApiProperty()
  summary: string

  @IsInt()
  @IsOptional()
  @ApiProperty()
  readingTime?: number | null

  @IsArray()
  @ArrayUnique()
  @IsPositive({ each: true })
  @NotEquals(null, { each: true })
  @NotEquals(undefined, { each: true })
  @IsNumber({}, { each: true })
  @ApiProperty()
  categoryIds: number[]
}

export class UpdateArticleRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty()
  title: string

  @IsString()
  @MaxLength(511)
  @IsOptional()
  @ApiProperty()
  thumbnail?: string | null

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  body: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(511)
  @ApiProperty()
  summary: string

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty()
  readingTime?: number | null

  @IsArray()
  @ArrayUnique()
  @IsPositive({ each: true })
  @IsNumber({}, { each: true })
  @ApiProperty()
  categoryIds: number[]
}

export class ScheduleArticleRequest {
  @IsPositive()
  @NotEquals(null)
  @NotEquals(undefined)
  @ApiProperty()
  time: number
}

export class AuthorResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  email: string

  @ApiProperty()
  username: string

  @ApiProperty()
  name: string

  @ApiProperty()
  photo?: string | null
}

export class CategoryResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string
}

export class HistoryResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  status: string

  @ApiProperty()
  createdAt: Date
}

export class ArticleResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  title: string

  @ApiProperty()
  thumbnail: string | null

  @ApiProperty()
  body: string

  @ApiProperty()
  summary: string

  @ApiProperty()
  readingTime: number | null

  @ApiProperty()
  status: string

  @ApiProperty()
  scheduledAt?: Date | null

  @ApiProperty()
  author: AuthorResponse

  @ApiProperty()
  categories: CategoryResponse[]

  @ApiProperty()
  histories: HistoryResponse[]
}
