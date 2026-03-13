import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { LoggerMiddleware } from "./common/middlewares/logger.middleware";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set("query parser", "extended");
  app.setGlobalPrefix("api/v1");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  const logger = new LoggerMiddleware();
  app.use(logger.use);

  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api/v1`);
}
bootstrap();
