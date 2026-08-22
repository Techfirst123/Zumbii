require('reflect-metadata');
const { NestFactory } = require('@nestjs/core');
const { ValidationPipe, VersioningType } = require('@nestjs/common');
const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');
const { ExpressAdapter } = require('@nestjs/platform-express');
const compression = require('compression');
const cors = require('cors');
const express = require('express');

const { AppModule } = require('../dist/app.module');
const { ADMIN_API_PATH_REGEX, corsOptionsFor } = require('../dist/common/cors.config');

let cachedApp;

async function bootstrap() {
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  const helmet = (await import('helmet')).default;
  app.use(helmet());
  app.use(compression());

  // Keep in sync with src/main.ts: admin routes get their own tighter CORS
  // policy, applied before the storefront-wide policy.
  app.use(ADMIN_API_PATH_REGEX, cors(corsOptionsFor('admin')));
  app.enableCors(corsOptionsFor('storefront'));

  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Zumbii API')
    .setDescription('Zumbii e-commerce API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.init();
  return expressApp;
}

module.exports = async function handler(req, res) {
  if (!cachedApp) {
    cachedApp = await bootstrap();
  }
  cachedApp(req, res);
};
