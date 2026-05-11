import { validateEnv } from './env.schema';

describe('validateEnv', () => {
  it('accepts a valid env object', () => {
    const result = validateEnv({
      PORT: '4000',
      DATABASE_URL:
        'postgresql://postgres:postgres@localhost:5432/blog_platform?schema=public',
      JWT_ACCESS_SECRET: '12345678901234567890123456789012',
      JWT_REFRESH_SECRET: 'abcdefghijklmnopqrstuvwxyz123456',
      JWT_ACCESS_TTL: '1h',
      JWT_REFRESH_TTL_DAYS: '30',
      AUTH_REFRESH_COOKIE_NAME: 'codenotes_refresh_token',
    });

    expect(result.JWT_REFRESH_TTL_DAYS).toBe(30);
    expect(result.JWT_ACCESS_TTL).toBe('1h');
  });

  it('throws when required values are missing', () => {
    expect(() =>
      validateEnv({
        PORT: '3001',
      }),
    ).toThrow();
  });
});
