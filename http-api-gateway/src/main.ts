import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { configuration } from './config/configuration';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const appConfig = configuration().app;
  const secret = appConfig.secret;
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.use(cookieParser(secret));

  await app.listen(3000);
}
bootstrap();
