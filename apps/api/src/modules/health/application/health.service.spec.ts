import { HealthService } from './health.service';

type PrismaServiceStub = {
  db: {
    $queryRaw: jest.Mock<
      Promise<unknown[]>,
      [TemplateStringsArray, ...unknown[]]
    >;
  };
};

describe('HealthService', () => {
  let service: HealthService;
  let prismaServiceStub: PrismaServiceStub;

  beforeEach(() => {
    prismaServiceStub = {
      db: {
        $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
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
});
