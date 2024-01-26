import { CacheModule } from '@nestjs/cache-manager'
import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
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
import { ProductCategory } from '@pengode/product-category/product-category'
import { ProductCategoryModule } from '@pengode/product-category/product-category.module'
import { ProductInvoiceHistory } from '@pengode/product-invoice-history/product-invoice-history'
import { ProductInvoiceHistoryModule } from '@pengode/product-invoice-history/product-invoice-history.module'
import { ProductInvoiceItem } from '@pengode/product-invoice-item/product-invoice-item'
import { ProductInvoice } from '@pengode/product-invoice/product-invoice'
import { ProductInvoiceModule } from '@pengode/product-invoice/product-invoice.module'
import { ProductLog } from '@pengode/product-log/product-log'
import { ProductLogModule } from '@pengode/product-log/product-log.module'
import { Product } from '@pengode/product/product'
import { ProductModule } from '@pengode/product/product.module'
import { Role } from '@pengode/role/role'
import { RoleModule } from '@pengode/role/role.module'
import { User } from '@pengode/user/user'
import { UserModule } from '@pengode/user/user.module'
import { ProductInvoiceItemModule } from '@pengode/product-invoice-item/product-invoice-item.module'
import { ProductCartModule } from '@pengode/product-cart/product-cart.module'
import { ProductCart } from '@pengode/product-cart/product-cart'

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
        entities: [
          Role,
          User,
          Article,
          ArticleCategory,
          ArticleHistory,
          Product,
          ProductCategory,
          ProductLog,
          ProductInvoice,
          ProductInvoiceItem,
          ProductInvoiceHistory,
          ProductCart,
        ],
        synchronize: true,
        logging: true,
      }),
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
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
    RoleModule,
    UserModule,
    AuthModule,
    ArticleModule,
    ArticleHistoryModule,
    ArticleCategoryModule,
    ProductModule,
    ProductCategoryModule,
    ProductLogModule,
    ProductInvoiceModule,
    ProductInvoiceHistoryModule,
    ProductInvoiceItemModule,
    ProductCartModule,
  ],
})
export class AppModule {}
