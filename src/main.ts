import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser'

import { MainModule } from './main.module';

const DEFAULT_PORT = 3001;

async function bootstrap() {
  const { PORT } = process.env
  const app = await NestFactory.create(MainModule, { cors: true });
  app.use(bodyParser.json({ limit: '2mb' }));
  app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }));
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    }
  }));
  const config = new DocumentBuilder()
    .setTitle('Rentmies API')
    .setDescription('Rentmies')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(PORT || DEFAULT_PORT);
}
bootstrap();
