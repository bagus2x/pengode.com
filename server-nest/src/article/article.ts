import { ArticleCategory } from '@pengode/article-category/article-category'
import { ArticleHistory } from '@pengode/article-history/article-history'
import { User } from '@pengode/user/user'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export enum Status {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
  DELETED = 'DELETED',
}

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 255 })
  title: string

  @Column({ name: 'thumbnail_url', length: 511, nullable: true })
  thumbnailUrl?: string | null

  @Column({ type: 'text' })
  body: string

  @Column({ length: 511 })
  summary: string

  @Column({ name: 'reading_time', nullable: true })
  readingTime: number | null

  @Column({ type: 'enum', enum: Status })
  status: Status

  @Column({ name: 'scheduled_at', nullable: true })
  scheduledAt: Date | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @ManyToOne(() => User, { eager: true })
  @JoinColumn([{ name: 'author_id', referencedColumnName: 'id' }])
  author: User

  @ManyToMany(() => ArticleCategory, { eager: true })
  @JoinTable({
    name: 'tr_article_category',
    joinColumn: {
      name: 'article_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
  })
  categories: ArticleCategory[]

  @OneToMany(() => ArticleHistory, (history) => history.article, {
    eager: true,
  })
  histories: ArticleHistory[]
}
