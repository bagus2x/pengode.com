import { Article, Status } from '@pengode/article/article'
import { User } from '@pengode/user/user'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class ArticleHistory {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'enum', enum: Status })
  status: Status

  @ManyToOne(() => Article)
  @JoinColumn([{ name: 'article_id', referencedColumnName: 'id' }])
  article: Article

  @ManyToOne(() => User)
  @JoinColumn([{ name: 'editor_id', referencedColumnName: 'id' }])
  editor: User

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
