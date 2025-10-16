import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from "cookie-parser";
import * as fs from "fs"

import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Tasks Management API')
    .setDescription("API for Tasks Management")
    .setVersion('1.0')
    .addCookieAuth('jwt')
    .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  fs.writeFileSync('./swagger.json', JSON.stringify(document, null, 2))

  app.use('/api-json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(document);
  })

  app.use(cookieParser())
  app.enableCors({
    origin: 'http://localhost:4000',
    credentials: true,
  })

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
