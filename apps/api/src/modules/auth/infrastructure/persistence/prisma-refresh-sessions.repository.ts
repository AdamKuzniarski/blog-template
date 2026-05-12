import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import type {
  CreateRefreshSessionInput,
  RefreshSessionsRepository,
} from '../../application/ports/refresh-sessions.repository';

@Injectable()
export class PrismaRefreshSessionRepository implements RefreshSessionsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(input: CreateRefreshSessionInput): Promise<void> {
    await this.prismaService.db.refreshSession.create({
      data: {
        id: input.id,
        userId: input.userId,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt,
        userAgent: input.userAgent,
        ipAddress: input.ipAddress,
      },
    });
  }
}
