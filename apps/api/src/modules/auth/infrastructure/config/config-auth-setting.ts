import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AuthSettings } from '../../application/ports/auth-settings';

@Injectable()
export class ConfigAuthSettings implements AuthSettings {
  constructor(private readonly configService: ConfigService) {}

  getRefreshTtlDays(): number {
    return this.configService.getOrThrow<number>('auth.refreshTtlDays');
  }
}
