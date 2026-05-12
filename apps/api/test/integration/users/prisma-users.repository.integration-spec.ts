import { Role } from '../../../src/generated/prisma/client';
import { PrismaUsersRepository } from '../../../src/modules/users/infrastructure/persistence/prisma-users.repository';
import { createTestPrismaService } from '../../support/create-test-prisma-service';
import {
  startPostgresTestDatabase,
  type TestDatabase,
} from '../../support/postgres-test-database';
import type { PrismaService } from '../../../src/database/prisma/prisma.service';

describe('PrismaUsersRepository (integration)', () => {
  let database: TestDatabase | null = null;
  let prismaService: PrismaService | null = null;
  let repository: PrismaUsersRepository | null = null;

  function getPrismaService(): PrismaService {
    if (!prismaService) {
      throw new Error(
        'Prisma test service was not initialized. Check the beforeAll error output.',
      );
    }

    return prismaService;
  }

  function getRepository(): PrismaUsersRepository {
    if (!repository) {
      throw new Error(
        'PrismaUsersRepository was not initialized. Check the beforeAll error output.',
      );
    }

    return repository;
  }

  beforeAll(async () => {
    database = await startPostgresTestDatabase();
    prismaService = await createTestPrismaService(database.databaseUrl);
    repository = new PrismaUsersRepository(prismaService);
  });

  beforeEach(async () => {
    const prisma = getPrismaService();
    await prisma.db.refreshSession.deleteMany();
    await prisma.db.user.deleteMany();
  });

  afterAll(async () => {
    if (prismaService) {
      await prismaService.onModuleDestroy();
    }

    if (database) {
      await database.stop();
    }
  });

  it('finds a user by email case-insensitively and maps it to domain user', async () => {
    const prisma = getPrismaService();
    const usersRepository = getRepository();

    const createdUser = await prisma.db.user.create({
      data: {
        email: 'admin@example.com',
        passwordHash: 'password-hash',
        name: 'Admin',
        role: Role.ADMIN,
      },
    });

    const result = await usersRepository.findByEmail('ADMIN@example.com');

    expect(result).toEqual({
      id: createdUser.id,
      email: 'admin@example.com',
      passwordHash: 'password-hash',
      name: 'Admin',
      role: Role.ADMIN,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    });
  });

  it('returns null when user does not exist', async () => {
    const usersRepository = getRepository();

    await expect(
      usersRepository.findByEmail('missing@example.com'),
    ).resolves.toBeNull();
    await expect(usersRepository.findById('missing-id')).resolves.toBeNull();
  });
});
