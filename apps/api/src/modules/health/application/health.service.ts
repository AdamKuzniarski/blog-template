import { Injectable } from '@nestjs/common';
import type { HealthResponseDto } from '../presentation/dto/health-response.dto';

@Injectable()
export class HealthService {
  getStatus(): HealthResponseDto {
    return {
      status: 'ok',
      service: 'api',
      timestamp: new Date().toISOString(),
    };
  }
}
