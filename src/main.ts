import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // Prefix untuk semua API
  app.setGlobalPrefix('api', {
    exclude: [
      {
        path: '/',
        method: RequestMethod.GET,
      },
    ],
  });

  // Mengizinkan request dari Next.js
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? true,
    credential: true,
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
