import { PrismaService } from '../../src/database/prisma/prisma.service';

export async function createTestPrismaService(
  databaseUrl: string,
): Promise<PrismaService> {
  process.env.DATABASE_URL = databaseUrl;

  const prismaService = new PrismaService();
  await prismaService.onModuleInit();

  return prismaService;
}
