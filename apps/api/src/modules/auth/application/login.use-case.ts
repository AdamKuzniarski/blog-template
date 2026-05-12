import { randomUUID } from 'crypto';
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AUTH_TOKEN_SERVICE,
  type AuthTokenService,
} from './ports/auth-token.service';
import { HASHING_SERVICE, type HashingService } from './ports/hashing.service';
import {
  REFRESH_SESSIONS_REPOSITORY,
  RefreshSessionsRepository,
} from './ports/refresh-sessions.repository';
import {
  USERS_REPOSITORY,
  type UsersRepository,
} from '../../users/application/ports/users.repository';
import type { LoginCommand } from './dto/login-command';

export type LoginResult = {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly user: {
    readonly id: string;
    readonly email: string;
    readonly name: string | null;
    readonly role: string;
  };
};

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
    @Inject(HASHING_SERVICE)
    private readonly hashingService: HashingService,
    @Inject(AUTH_TOKEN_SERVICE)
    private readonly authTokenService: AuthTokenService,
    @Inject(REFRESH_SESSIONS_REPOSITORY)
    private readonly refreshSessionsRepository: RefreshSessionsRepository,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    const normalizedEmail = command.email.trim().toLowerCase();

    const user = await this.usersRepository.findByEmail(normalizedEmail);
    if (user === null) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const passwordMatches = await this.hashingService.compare(
      command.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const sessionId = randomUUID();

    const accessToken = await this.authTokenService.signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'access',
    });

    const refreshToken = await this.authTokenService.signRefreshToken({
      sub: user.id,
      sid: sessionId,
      type: 'refresh',
    });

    const refreshTokenHash = await this.hashingService.hash(refreshToken);
    const refreshTtlDays = this.configService.getOrThrow<number>(
      'auth.refreshTtlDays',
    );

    await this.refreshSessionsRepository.create({
      id: sessioId,
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: addDays(new Date(), refreshTtlDays),
      userAgent: command.userAgent,
      ipAddress: command.ipAddress,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
