import { Role } from '../../../src/generated/prisma/client';
import { PrismaRefreshSessionRepository } from '../../../src/modules/auth/infrastructure/persistence/prisma-refresh-sessions.repository';
import { createTestPrismaService } from '../../support/create-test-prisma-service';
import {
  startPostgresTestDatabase,
  type TestDatabase,
} from '../../support/postgres-test-database';
import type { PrismaService } from '../../../src/database/prisma/prisma.service';

describe('PrismaRefreshSessionRepository (integration)', () => {
  let database: TestDatabase | null = null;
  let prismaService: PrismaService | null = null;
  let repository: PrismaRefreshSessionRepository | null = null;
  let userId: string;

  function getPrismaService(): PrismaService {
    if (!prismaService) {
      throw new Error(
        'Prisma test service was not initialized. Check the beforeAll error output.',
      );
    }

    return prismaService;
  }

  function getRepository(): PrismaRefreshSessionRepository {
    if (!repository) {
      throw new Error(
        'PrismaRefreshSessionRepository was not initialized. Check the beforeAll error output.',
      );
    }

    return repository;
  }

  beforeAll(async () => {
    database = await startPostgresTestDatabase();
    prismaService = await createTestPrismaService(database.databaseUrl);
    repository = new PrismaRefreshSessionRepository(prismaService);
  });

  beforeEach(async () => {
    const prisma = getPrismaService();
    await prisma.db.refreshSession.deleteMany();
    await prisma.db.user.deleteMany();

    const user = await prisma.db.user.create({
      data: {
        email: 'admin@example.com',
        passwordHash: 'password-hash',
        name: 'Admin',
        role: Role.ADMIN,
      },
    });

    userId = user.id;
  });

  afterAll(async () => {
    if (prismaService) {
      await prismaService.onModuleDestroy();
    }

    if (database) {
      await database.stop();
    }
  });

  it('creates a refresh session', async () => {
    const prisma = getPrismaService();
    const refreshSessionRepository = getRepository();
    const expiresAt = new Date('2026-06-01T00:00:00.000Z');

    await refreshSessionRepository.create({
      id: 'session-1',
      userId,
      tokenHash: 'hashed-refresh-token',
      expiresAt,
      userAgent: 'jest-integration',
      ipAddress: '127.0.0.1',
    });

    const session = await prisma.db.refreshSession.findUniqueOrThrow({
      where: {
        id: 'session-1',
      },
    });

    expect(session.userId).toBe(userId);
    expect(session.tokenHash).toBe('hashed-refresh-token');
    expect(session.expiresAt).toEqual(expiresAt);
    expect(session.revokedAt).toBeNull();
    expect(session.userAgent).toBe('jest-integration');
    expect(session.ipAddress).toBe('127.0.0.1');
  });
});
