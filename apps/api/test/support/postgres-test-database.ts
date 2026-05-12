import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';

const API_ROOT = resolveApiRoot();

export type TestDatabase = {
  readonly databaseUrl: string;
  stop(): Promise<void>;
};

export async function startPostgresTestDatabase(): Promise<TestDatabase> {
  const container: StartedPostgreSqlContainer = await new PostgreSqlContainer(
    'postgres:16-alpine',
  )
    .withDatabase('blog_platform_test')
    .withUsername('test')
    .withPassword('test')
    .start();

  const databaseUrl = `${container.getConnectionUri()}?schema=public`;

  runPrismaMigrations(databaseUrl);

  return {
    databaseUrl,
    async stop(): Promise<void> {
      await container.stop();
    },
  };
}

function resolveApiRoot(): string {
  const candidates = [
    process.cwd(),
    join(process.cwd(), 'apps', 'api'),
    resolve(__dirname, '..', '..'),
  ];

  for (const candidate of candidates) {
    if (existsSync(join(candidate, 'prisma', 'schema.prisma'))) {
      return candidate;
    }
  }

  throw new Error(
    `Could not resolve apps/api root. Tried: ${candidates.join(', ')}`,
  );
}

function runPrismaMigrations(databaseUrl: string): void {
  const prismaCliEntrypoint = join(
    API_ROOT,
    'node_modules',
    'prisma',
    'build',
    'index.js',
  );
  const schemaPath = join(API_ROOT, 'prisma', 'schema.prisma');

  if (!existsSync(prismaCliEntrypoint)) {
    throw new Error(
      `Prisma CLI not found at ${prismaCliEntrypoint}. Run pnpm install in apps/api.`,
    );
  }

  try {
    execFileSync(
      process.execPath,
      [prismaCliEntrypoint, 'migrate', 'deploy', '--schema', schemaPath],
      {
        cwd: API_ROOT,
        env: {
          ...process.env,
          DATABASE_URL: databaseUrl,
        },
        stdio: 'pipe',
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const stderr = getCommandOutput(error, 'stderr');
    const stdout = getCommandOutput(error, 'stdout');

    throw new Error(
      `Prisma migrate deploy failed for test database.\n` +
        `cwd: ${API_ROOT}\n` +
        `schema: ${schemaPath}\n` +
        `command: node ${prismaCliEntrypoint} migrate deploy --schema ${schemaPath}\n` +
        `${message}\n` +
        `stdout:\n${stdout || '<empty>'}\n` +
        `stderr:\n${stderr || '<empty>'}`,
    );
  }
}

function getCommandOutput(error: unknown, key: 'stdout' | 'stderr'): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    key in error &&
    (typeof (error as Record<string, unknown>)[key] === 'string' ||
      Buffer.isBuffer((error as Record<string, unknown>)[key]))
  ) {
    const value = (error as Record<string, unknown>)[key];
    if (typeof value === 'string') {
      return value.trim();
    }

    return (value as Buffer).toString('utf8').trim();
  }

  return '';
}
