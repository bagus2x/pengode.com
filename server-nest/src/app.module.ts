import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ArticleCategory } from '@pengode/article-category/article-category'
import { ArticleCategoryModule } from '@pengode/article-category/article-category.module'
import { ArticleHistory } from '@pengode/article-history/article-history'
import { ArticleHistoryModule } from '@pengode/article-history/article-history.module'
import { Article } from '@pengode/article/article'
import { ArticleModule } from '@pengode/article/article.module'
import { AuthModule } from '@pengode/auth/auth.module'
import { Role } from '@pengode/role/role'
import { User } from '@pengode/user/user'
import { UserModule } from '@pengode/user/user.module'
import { RoleModule } from './role/role.module'
import { ClsModule } from 'nestjs-cls'

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: +config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [User, Role, Article, ArticleCategory, ArticleHistory],
        synchronize: true,
        logging: true,
      }),
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        // automatically mount the
        // ClsMiddleware for all routes
        mount: true,
        // and use the setup method to
        // provide default store values.
        setup: (cls, req) => {
          cls.set('userId', req.headers['x-user-id'])
        },
      },
    }),
    UserModule,
    AuthModule,
    ArticleModule,
    ArticleHistoryModule,
    ArticleCategoryModule,
    RoleModule,
  ],
})
export class AppModule {}
