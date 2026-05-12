import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type {
  AccessTokenPayload,
  AuthTokenService,
  RefreshTokenPayload,
} from '../../application/ports/auth-token.service';

@Injectable()
export class JwtAuthTokenService implements AuthTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signAccessToken(payload: AccessTokenPayload): Promise<string> {
    const secret = this.configService.getOrThrow<string>('auth.accessSecret');
    const expiresIn = this.configService.getOrThrow<string>('auth.accessTtl');
    const options: JwtSignOptions = {
      secret,
      expiresIn: expiresIn as NonNullable<JwtSignOptions['expiresIn']>,
    };

    return this.jwtService.signAsync(payload, options);
  }

  async signRefreshToken(payload: RefreshTokenPayload): Promise<string> {
    const secret = this.configService.getOrThrow<string>('auth.refreshSecret');
    const refreshTtlDays = this.configService.getOrThrow<number>(
      'auth.refreshTtlDays',
    );
    const options: JwtSignOptions = {
      secret,
      expiresIn: `${refreshTtlDays}d`,
    };

    return this.jwtService.signAsync(payload, options);
  }
}
