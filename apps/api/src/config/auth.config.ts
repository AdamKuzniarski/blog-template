import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET ?? '',
  refreshSecret: process.env.JWT_REFRESH_SECRET ?? '',
  accessTtl: process.env.JWT_ACCESS_TTL ?? '1h',
  refreshTtlDays: Number(process.env.JWT_REFRESH_TTL_DAYS ?? '30'),
  refreshCookieName:
    process.env.AUTH_REFRESH_COOKIE_NAME ?? 'codenotes_refresh_token',
}));
