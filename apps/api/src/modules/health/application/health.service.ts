import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';
import type { HealthResponseDto } from '../presentation/dto/health-response.dto';

@Injectable()
export class HealthService {
  constructor(private readonly prismaService: PrismaService) {}

  async getStatus(): Promise<HealthResponseDto> {
    await this.prismaService.db.$queryRaw`SELECT 1`;

    return {
      status: 'ok',
      service: 'api',
      database: 'up',
      timestamp: new Date().toISOString(),
    };
  }
}
