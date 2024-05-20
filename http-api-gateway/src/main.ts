import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { configuration } from './config/configuration';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const appConfig = configuration().app;
  const secret = appConfig.secret;
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix('api');

  //! Cors
  // todo: change to domain for registered facilities
  app.enableCors({
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .addCookieAuth('token')
    .setTitle('CDR')
    .setDescription('Documentation')
    .setVersion('1.0')
    .build();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api/v1');

  app.use(cookieParser(secret));

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api/v1/docs', app, document);

  await app.listen(3000);
}
bootstrap();
