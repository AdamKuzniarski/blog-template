import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { authConfig } from './config/auth.config';
import { validateEnv } from './config/env.schema';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [authConfig],
      validate: validateEnv,
    }),
    HealthModule,
    AuthModule,
  ],
})
export class AppModule {}
