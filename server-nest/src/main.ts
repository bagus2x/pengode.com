import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Logger } from 'nestjs-pino'

import { AppModule } from '@pengode/app.module'
import { env } from '@pengode/common/utils'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  )
  app.setGlobalPrefix('/api/v1')

  // Cors
  app.enableCors()

  // Logger
  app.useLogger(app.get(Logger))

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Pengode')
    .setDescription('The Pengode API')
    .setVersion('1.0')
    .addTag('pengode')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/api/v1', app, document)

  // Validator
  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  const port = env('PORT')
  await app.listen(port, '0.0.0.0')
}

bootstrap()
