import { Role } from '../../../generated/prisma/client';
import { LoginUseCase } from './login.use-case';
import type { AuthSettings } from './ports/auth-settings';
import type {
  AccessTokenPayload,
  AuthTokenService,
  RefreshTokenPayload,
} from './ports/auth-token.service';
import type { HashingService } from './ports/hashing.service';
import type {
  CreateRefreshSessionInput,
  RefreshSessionsRepository,
} from './ports/refresh-sessions.repository';
import type { UsersRepository } from '../../users/application/ports/users.repository';
import type { User } from '../../users/domain/user';

declare const describe: (name: string, fn: () => void) => void;
declare const beforeEach: (fn: () => void) => void;
declare const it: (name: string, fn: () => void | Promise<void>) => void;
declare const expect: any;

class FakeUsersRepository implements UsersRepository {
  public user: User | null = null;
  public findByEmailCalls: string[] = [];

  async findByEmail(email: string): Promise<User | null> {
    this.findByEmailCalls.push(email);
    return this.user;
  }

  async findById(id: string): Promise<User | null> {
    void id;
    return this.user;
  }
}

class FakeHashingService implements HashingService {
  public passwordMatches = true;
  public hashCalls: string[] = [];
  public compareCalls: Array<{ value: string; hashedValue: string }> = [];

  async hash(value: string): Promise<string> {
    this.hashCalls.push(value);
    return `hashed:${value}`;
  }

  async compare(value: string, hashedValue: string): Promise<boolean> {
    this.compareCalls.push({ value, hashedValue });
    return this.passwordMatches;
  }
}

class FakeAuthTokenService implements AuthTokenService {
  public accessPayloads: AccessTokenPayload[] = [];
  public refreshPayloads: RefreshTokenPayload[] = [];

  async signAccessToken(payload: AccessTokenPayload): Promise<string> {
    this.accessPayloads.push(payload);
    return 'access-token';
  }

  async signRefreshToken(payload: RefreshTokenPayload): Promise<string> {
    this.refreshPayloads.push(payload);
    return 'refresh-token';
  }
}

class FakeRefreshSessionsRepository implements RefreshSessionsRepository {
  public createdSessions: CreateRefreshSessionInput[] = [];

  async create(input: CreateRefreshSessionInput): Promise<void> {
    this.createdSessions.push(input);
  }
}

class FakeAuthSettings implements AuthSettings {
  getRefreshTtlDays(): number {
    return 30;
  }
}

describe('LoginUseCase', () => {
  let usersRepository: FakeUsersRepository;
  let hashingService: FakeHashingService;
  let tokenService: FakeAuthTokenService;
  let refreshSessionsRepository: FakeRefreshSessionsRepository;
  let useCase: LoginUseCase;

  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    hashingService = new FakeHashingService();
    tokenService = new FakeAuthTokenService();
    refreshSessionsRepository = new FakeRefreshSessionsRepository();

    useCase = new LoginUseCase(
      usersRepository,
      hashingService,
      tokenService,
      refreshSessionsRepository,
      new FakeAuthSettings(),
    );
  });

  it('logs in a valid user and stores a hashed refresh session', async () => {
    usersRepository.user = createUser();

    const result = await useCase.execute({
      email: 'ADMIN@example.com',
      password: 'ChangeMeNow123!',
      userAgent: 'unit-test',
      ipAddress: '127.0.0.1',
    });

    expect(usersRepository.findByEmailCalls).toEqual(['admin@example.com']);
    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
    expect(result.user).toEqual({
      id: 'user-1',
      email: 'admin@example.com',
      name: 'Admin',
      role: 'ADMIN',
    });

    expect(hashingService.compareCalls).toEqual([
      {
        value: 'ChangeMeNow123!',
        hashedValue: 'password-hash',
      },
    ]);

    expect(refreshSessionsRepository.createdSessions).toHaveLength(1);
    expect(refreshSessionsRepository.createdSessions[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        userId: 'user-1',
        tokenHash: 'hashed:refresh-token',
        expiresAt: expect.any(Date),
        userAgent: 'unit-test',
        ipAddress: '127.0.0.1',
      }),
    );

    expect(tokenService.accessPayloads[0]).toEqual(
      expect.objectContaining({
        sub: 'user-1',
        sid: expect.any(String),
        role: Role.ADMIN,
        type: 'access',
      }),
    );

    expect(tokenService.refreshPayloads[0]).toEqual(
      expect.objectContaining({
        sub: 'user-1',
        sid: tokenService.accessPayloads[0]?.sid,
        type: 'refresh',
      }),
    );
  });

  it('rejects missing users', async () => {
    usersRepository.user = null;

    await expect(
      useCase.execute({
        email: 'missing@example.com',
        password: 'ChangeMeNow123!',
      }),
    ).rejects.toThrow();
  });

  it('rejects invalid passwords', async () => {
    usersRepository.user = createUser();
    hashingService.passwordMatches = false;

    await expect(
      useCase.execute({
        email: 'admin@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toThrow();
  });
});

function createUser(): User {
  return {
    id: 'user-1',
    email: 'admin@example.com',
    passwordHash: 'password-hash',
    name: 'Admin',
    role: Role.ADMIN,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };
}
