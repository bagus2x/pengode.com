import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager'
import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { redisStore } from 'cache-manager-redis-store'
import { ClsModule } from 'nestjs-cls'

import { ArticleCategory } from '@pengode/article-category/article-category'
import { ArticleCategoryModule } from '@pengode/article-category/article-category.module'
import { ArticleHistory } from '@pengode/article-history/article-history'
import { ArticleHistoryModule } from '@pengode/article-history/article-history.module'
import { Article } from '@pengode/article/article'
import { ArticleModule } from '@pengode/article/article.module'
import { AuthModule } from '@pengode/auth/auth.module'
import { Role } from '@pengode/role/role'
import { RoleModule } from '@pengode/role/role.module'
import { User } from '@pengode/user/user'
import { UserModule } from '@pengode/user/user.module'

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
    CacheModule.register({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get<string>('REDIS_HOST'),
            port: parseInt(configService.get<string>('REDIS_PORT')!),
          },
        })
        return {
          store: () => store,
        }
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    ArticleModule,
    ArticleHistoryModule,
    ArticleCategoryModule,
    RoleModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
