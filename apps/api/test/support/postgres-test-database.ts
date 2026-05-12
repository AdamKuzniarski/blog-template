import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
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
  applyDockerEnvironmentFallbacks();

  let container: StartedPostgreSqlContainer | null = null;
  try {
    container = await new PostgreSqlContainer('postgres:16-alpine')
      .withDatabase('blog_platform_test')
      .withUsername('test')
      .withPassword('test')
      .start();
  } catch (error) {
    const fallbackDatabase = await tryStartPostgresViaDockerCli();
    if (fallbackDatabase) {
      return fallbackDatabase;
    }

    const message = error instanceof Error ? error.message : String(error);
    throw new Error([
      'Failed to start postgres test container.',
      message,
      buildDockerRuntimeDiagnostics(),
      'Fallback via Docker CLI also failed.',
      buildDockerCliDiagnostics(),
    ].join('\n'));
  }

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

function applyDockerEnvironmentFallbacks(): void {
  const socketCandidates = [
    '/var/run/docker.sock',
    join(homedir(), '.colima', 'default', 'docker.sock'),
    join(homedir(), '.orbstack', 'run', 'docker.sock'),
    join(homedir(), '.rd', 'docker.sock'),
  ];

  const currentDockerHost = process.env.DOCKER_HOST;
  const parsedCurrentSocketPath = parseUnixSocketPath(currentDockerHost);

  if (parsedCurrentSocketPath && !existsSync(parsedCurrentSocketPath)) {
    const fallbackSocketPath = socketCandidates.find((path) => existsSync(path));
    if (fallbackSocketPath) {
      process.env.DOCKER_HOST = `unix://${fallbackSocketPath}`;
    }
  }

  if (!process.env.DOCKER_HOST) {
    const fallbackSocketPath = socketCandidates.find((path) => existsSync(path));
    if (fallbackSocketPath) {
      process.env.DOCKER_HOST = `unix://${fallbackSocketPath}`;
    }
  }

  const effectiveSocketPath = parseUnixSocketPath(process.env.DOCKER_HOST);
  if (
    effectiveSocketPath &&
    effectiveSocketPath !== '/var/run/docker.sock' &&
    !process.env.TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE
  ) {
    process.env.TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE = '/var/run/docker.sock';
  }
}

function parseUnixSocketPath(dockerHost: string | undefined): string | null {
  if (!dockerHost) {
    return null;
  }

  if (!dockerHost.startsWith('unix://')) {
    return null;
  }

  return dockerHost.slice('unix://'.length);
}

function buildDockerRuntimeDiagnostics(): string {
  const dockerHost = process.env.DOCKER_HOST || '<unset>';
  const dockerSocketOverride =
    process.env.TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE || '<unset>';
  const sockets = [
    '/var/run/docker.sock',
    join(homedir(), '.colima', 'default', 'docker.sock'),
    join(homedir(), '.orbstack', 'run', 'docker.sock'),
    join(homedir(), '.rd', 'docker.sock'),
  ];
  const socketState = sockets
    .map((path) => `${path}: ${existsSync(path) ? 'exists' : 'missing'}`)
    .join('\n');

  return [
    'Docker runtime diagnostics:',
    `DOCKER_HOST=${dockerHost}`,
    `TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=${dockerSocketOverride}`,
    socketState,
  ].join('\n');
}

async function tryStartPostgresViaDockerCli(): Promise<TestDatabase | null> {
  const dockerVersion = getDockerVersion();
  if (!dockerVersion) {
    return null;
  }

  const containerName = `blog-platform-test-${Date.now()}-${Math.floor(
    Math.random() * 1000,
  )}`;
  let containerId = '';

  try {
    containerId = execFileSync(
      'docker',
      [
        'run',
        '-d',
        '--rm',
        '--name',
        containerName,
        '-e',
        'POSTGRES_DB=blog_platform_test',
        '-e',
        'POSTGRES_USER=test',
        '-e',
        'POSTGRES_PASSWORD=test',
        '-p',
        '127.0.0.1::5432',
        'postgres:16-alpine',
      ],
      {
        encoding: 'utf8',
        stdio: 'pipe',
      },
    ).trim();

    await waitForPostgresToBecomeReady(containerId, 30_000);

    const exposedPortOutput = execFileSync(
      'docker',
      ['port', containerId, '5432/tcp'],
      {
        encoding: 'utf8',
        stdio: 'pipe',
      },
    )
      .trim()
      .split('\n')[0]
      ?.trim();

    const port = parseDockerPort(exposedPortOutput || '');
    if (!port) {
      throw new Error(`Could not parse docker port output: ${exposedPortOutput}`);
    }

    const databaseUrl = `postgresql://test:test@127.0.0.1:${port}/blog_platform_test?schema=public`;
    runPrismaMigrations(databaseUrl);

    return {
      databaseUrl,
      async stop(): Promise<void> {
        stopDockerContainer(containerId);
      },
    };
  } catch {
    if (containerId) {
      stopDockerContainer(containerId);
    }
    return null;
  }
}

function getDockerVersion(): string | null {
  try {
    return execFileSync('docker', ['version', '--format', '{{.Server.Version}}'], {
      encoding: 'utf8',
      stdio: 'pipe',
    }).trim();
  } catch {
    return null;
  }
}

async function waitForPostgresToBecomeReady(
  containerId: string,
  timeoutMs: number,
): Promise<void> {
  const startedAt = Date.now();

  while (Date.now() - startedAt <= timeoutMs) {
    try {
      execFileSync(
        'docker',
        ['exec', containerId, 'pg_isready', '-U', 'test', '-d', 'blog_platform_test'],
        {
          stdio: 'ignore',
        },
      );
      return;
    } catch {
      await new Promise((resolvePromise) => {
        setTimeout(resolvePromise, 250);
      });
    }
  }

  throw new Error('Timed out waiting for postgres container to become ready');
}

function stopDockerContainer(containerId: string): void {
  try {
    execFileSync('docker', ['rm', '-f', containerId], {
      stdio: 'ignore',
    });
  } catch {
    // Ignore cleanup errors in tests.
  }
}

function parseDockerPort(portOutput: string): string | null {
  const separatorIndex = portOutput.lastIndexOf(':');
  if (separatorIndex === -1) {
    return null;
  }

  const port = portOutput.slice(separatorIndex + 1).trim();
  return /^\d+$/.test(port) ? port : null;
}

function buildDockerCliDiagnostics(): string {
  const dockerVersion = getDockerVersion();
  if (!dockerVersion) {
    return 'Docker CLI diagnostics: docker command unavailable from this process.';
  }

  return `Docker CLI diagnostics: docker server version ${dockerVersion}`;
}
