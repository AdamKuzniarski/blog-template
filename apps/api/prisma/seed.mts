import 'dotenv/config';
import { hash } from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { z } from 'zod';
import { PrismaClient, Role } from '../src/generated/prisma/client';

const seedEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SEED_ADMIN_EMAIL: z.string().email(),
  SEED_ADMIN_PASSWORD: z.string().min(12),
  SEED_ADMIN_NAME: z.string().min(1),
});

async function main(): Promise<void> {
  const env = seedEnvSchema.parse(process.env);

  const pool = new Pool({
    connectionString: env.DATABASE_URL,
  });

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    await prisma.$connect();

    const passwordHash = await hash(env.SEED_ADMIN_PASSWORD, 12);

    const adminUser = await prisma.user.upsert({
      where: {
        email: env.SEED_ADMIN_EMAIL,
      },
      update: {
        name: env.SEED_ADMIN_NAME,
        passwordHash,
        role: Role.ADMIN,
      },
      create: {
        email: env.SEED_ADMIN_EMAIL,
        name: env.SEED_ADMIN_NAME,
        passwordHash,
        role: Role.ADMIN,
      },
    });

    console.log(`Seeded admin user: ${adminUser.email}`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

void main().catch((error: unknown) => {
  console.error('Failed to seed admin user.');
  console.error(error);
  process.exit(1);
});
