import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureHttpApp } from '../src/bootstrap/configure-http-app';
import type { HealthResponseDto } from '../src/modules/health/presentation/dto/health-response.dto';

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    configureHttpApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/health returns service health', async () => {
    const httpServer = app.getHttpServer() as unknown as Parameters<
      typeof request
    >[0];

    const response = await request(httpServer).get('/api/health').expect(200);

    const body = response.body as unknown as HealthResponseDto;

    expect(body.status).toBe('ok');
    expect(body.service).toBe('api');
    expect(body.database).toBe('up');
    expect(typeof body.timestamp).toBe('string');
    expect(Number.isNaN(Date.parse(body.timestamp))).toBe(false);
  });
});
