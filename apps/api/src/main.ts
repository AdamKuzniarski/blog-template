import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureHttpApp } from './bootstrap/configure-http-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureHttpApp(app);

  const port = parsePort(process.env.PORT);

  await app.listen(port);
}

function parsePort(value: string | undefined): number {
  if (value === undefined) {
    return 4000;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return 4000;
  }

  return parsed;
}

void bootstrap();
