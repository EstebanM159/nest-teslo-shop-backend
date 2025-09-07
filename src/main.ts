import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Teslo RESTFul API')
    .setDescription('Teslo shop endpoints')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const SELF_URL =
    process.env.SELF_URL ||
    `https://nest-teslo-shop-backend-30bc.onrender.com/api`;
  // 👆 Crea la variable SELF_URL en Render con la URL real de tu app

  if (process.env.RENDER) {
    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(SELF_URL);
        logger.log(`Ping enviado: ${res.status}`);
      } catch (err) {
        logger.error(`Error en autopinger: ${err.message}`);
      }
    }, 10 * 60 * 1000); // cada 14 minutos
  }

  await app.listen(process.env.PORT);
  logger.log(`App running on port ${process.env.PORT}`);
}
bootstrap();
