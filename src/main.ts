import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Autoriser les requêtes du frontend
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  // Middleware pour servir les fichiers statiques uploadés
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Validation globale (DTO, etc.)
  app.useGlobalPipes(new ValidationPipe());

  const uploadDir = join(__dirname, '..', 'uploads');
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
