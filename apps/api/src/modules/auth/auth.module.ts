import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { LoginUseCase } from './application/login.use-case';
import { AUTH_TOKEN_SERVICE } from './application/ports/auth-token.service';
import { HASHING_SERVICE } from './application/ports/hashing.service';
import { REFRESH_SESSIONS_REPOSITORY } from './application/ports/refresh-sessions.repository';
import { BcryptHashingService } from './infrastructure/crypto/bcrypt-hashing.service';
import { JwtAuthTokenService } from './infrastructure/jwt/jwt-auth-token.service';
import { PrismaRefreshSessionRepository } from './infrastructure/persistence/prisma-refresh-sessions.repository';
import { AuthController } from './presentation/auth.controller';
import { AUTH_SETTINGS } from './application/ports/auth-settings';
import { ConfigAuthSettings } from './infrastructure/config/config-auth-setting';

@Module({
  imports: [JwtModule.register({}), PrismaModule, UsersModule],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    BcryptHashingService,
    JwtAuthTokenService,
    PrismaRefreshSessionRepository,
    {
      provide: HASHING_SERVICE,
      useExisting: BcryptHashingService,
    },
    {
      provide: AUTH_TOKEN_SERVICE,
      useExisting: JwtAuthTokenService,
    },
    {
      provide: REFRESH_SESSIONS_REPOSITORY,
      useExisting: PrismaRefreshSessionRepository,
    },
    {
      provide: AUTH_SETTINGS,
      useExisting: ConfigAuthSettings,
    },
  ],
})
export class AuthModule {}
