import { Module } from '@nestjs/common';
import { HealthService } from './application/health.service';
import { HealthController } from './presentation/health.controller';
import { PrismaModule } from '../../database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
