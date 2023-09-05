import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { MainModule } from './main.module';

const DEFAULT_PORT = 3000;

async function bootstrap() {
  const { PORT } = process.env
  const app = await NestFactory.create(MainModule, { cors: true });
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
    .setTitle('UWOD API')
    .setDescription('UWOD, innovadora aplicación de tecnología deportiva.')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(PORT || DEFAULT_PORT);
}
bootstrap();
