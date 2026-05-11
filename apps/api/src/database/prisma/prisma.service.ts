import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool | null = null;
  private client: PrismaClient | null = null;

  async onModuleInit(): Promise<void> {
    const connectionString = process.env.DATABASE_URL;

    if (connectionString === undefined || connectionString.length === 0) {
      throw new Error('DATABASE_URL is not configured.');
    }

    this.pool = new Pool({
      connectionString,
    });

    const adapterModule = await import('@prisma/adapter-pg');
    const adapter = new adapterModule.PrismaPg(this.pool);

    this.client = new PrismaClient({
      adapter,
    });

    await this.client.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client !== null) {
      await this.client.$disconnect();
    }

    if (this.pool !== null) {
      await this.pool.end();
    }
  }

  get db(): PrismaClient {
    if (this.client === null) {
      throw new Error('PrismaClient has not been initialized yet.');
    }

    return this.client;
  }
}
