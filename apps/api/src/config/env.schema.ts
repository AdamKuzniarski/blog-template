export type EnvironmentVariables = {
  readonly PORT?: string;
  readonly DATABASE_URL: string;
  readonly JWT_ACCESS_SECRET: string;
  readonly JWT_REFRESH_SECRET: string;
  readonly JWT_ACCESS_TTL: string;
  readonly JWT_REFRESH_TTL_DAYS: number;
  readonly AUTH_REFRESH_COOKIE_NAME: string;
};

export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const port = readOptionalString(config.PORT, 'PORT');
  const databaseUrl = readRequiredString(config.DATABASE_URL, 'DATABASE_URL');
  const accessSecret = readRequiredString(
    config.JWT_ACCESS_SECRET,
    'JWT_ACCESS_SECRET',
  );
  const refreshSecret = readRequiredString(
    config.JWT_REFRESH_SECRET,
    'JWT_REFRESH_SECRET',
  );
  const accessTtl = readRequiredString(config.JWT_ACCESS_TTL, 'JWT_ACCESS_TTL');
  const refreshTtlDaysRaw = readRequiredString(
    config.JWT_REFRESH_TTL_DAYS,
    'JWT_REFRESH_TTL_DAYS',
  );
  const refreshCookieName = readRequiredString(
    config.AUTH_REFRESH_COOKIE_NAME,
    'AUTH_REFRESH_COOKIE_NAME',
  );

  if (accessSecret.length < 32) {
    throw new Error('JWT_ACCESS_SECRET must be at least 32 characters long.');
  }

  if (refreshSecret.length < 32) {
    throw new Error('JWT_REFRESH_SECRET must be at least 32 characters long.');
  }

  const refreshTtlDays = Number(refreshTtlDaysRaw);

  if (
    !Number.isInteger(refreshTtlDays) ||
    refreshTtlDays <= 0 ||
    refreshTtlDays > 365
  ) {
    throw new Error(
      'JWT_REFRESH_TTL_DAYS must be an integer between 1 and 365.',
    );
  }

  return {
    ...(port !== undefined ? { PORT: port } : {}),
    DATABASE_URL: databaseUrl,
    JWT_ACCESS_SECRET: accessSecret,
    JWT_REFRESH_SECRET: refreshSecret,
    JWT_ACCESS_TTL: accessTtl,
    JWT_REFRESH_TTL_DAYS: refreshTtlDays,
    AUTH_REFRESH_COOKIE_NAME: refreshCookieName,
  };
}

function readRequiredString(value: unknown, name: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

function readOptionalString(value: unknown, name: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new Error(`${name} must be a string.`);
  }

  return value;
}
