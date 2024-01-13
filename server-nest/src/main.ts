import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from '@pengode/app.module'
import { env } from '@pengode/common/utils'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('/api')

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Pengode')
    .setDescription('The Pengode API')
    .setVersion('1.0')
    .addTag('pengode')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  // Validator
  app.useGlobalPipes(new ValidationPipe())

  const port = env('PORT')
  await app.listen(port, () => `Server is listening to port ${port}`)
}

bootstrap()
