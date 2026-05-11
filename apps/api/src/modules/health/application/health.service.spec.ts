import { ServiceUnavailableException } from '@nestjs/common';
import { HealthService } from './health.service';

type QueryRawFn = (
  query: TemplateStringsArray,
  ...values: unknown[]
) => Promise<unknown[]>;

type PrismaServiceStub = {
  db: {
    $queryRaw: jest.MockedFunction<QueryRawFn>;
  };
};

describe('HealthService', () => {
  let service: HealthService;
  let prismaServiceStub: PrismaServiceStub;

  beforeEach(() => {
    const queryRawMock: jest.MockedFunction<QueryRawFn> = jest
      .fn<ReturnType<QueryRawFn>, Parameters<QueryRawFn>>()
      .mockResolvedValue([{ '?column?': 1 }]);

    prismaServiceStub = {
      db: {
        $queryRaw: queryRawMock,
      },
    };

    service = new HealthService(prismaServiceStub as never);
  });

  it('returns an ok health payload', async () => {
    const result = await service.getStatus();

    expect(result.status).toBe('ok');
    expect(result.service).toBe('api');
    expect(result.database).toBe('up');
    expect(Number.isNaN(Date.parse(result.timestamp))).toBe(false);
  });

  it('throws 503 when database query fails', async () => {
    prismaServiceStub.db.$queryRaw.mockRejectedValueOnce(
      new Error('Connection refused'),
    );

    await expect(service.getStatus()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
