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
import { PrismaRefreshSessionsRepository } from './infrastructure/persistence/prisma-refresh-sessions.repository';
import { AuthController } from './presentation/auth.controller';

@Module({
  imports: [JwtModule.register({}), PrismaModule, UsersModule],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    BcryptHashingService,
    JwtAuthTokenService,
    PrismaRefreshSessionsRepository,
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
      useExisting: PrismaRefreshSessionsRepository,
    },
  ],
})
export class AuthModule {}
