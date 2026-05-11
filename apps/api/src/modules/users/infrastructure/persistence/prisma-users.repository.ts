import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import type { User } from '../../domain/user';
import type { UsersRepository } from '../../application/ports/users.repository';
import type { User as PrismaUser } from '../../../../generated/prisma/client';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.db.user.findUnique({
      where: {
        email,
      },
    });
    if (user === null) {
      return null;
    }
    return toDomainUser(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prismaService.db.user.findUnique({
      where: {
        id,
      },
    });
    if (user === null) {
      return null;
    }
    return toDomainUser(user);
  }
}

function toDomainUser(user: PrismaUser): User {
  return {
    id: user.id,
    email: user.email,
    passwordHash: user.passwordHash,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
