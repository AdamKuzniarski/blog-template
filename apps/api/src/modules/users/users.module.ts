import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { USERS_REPOSITORY } from './application/ports/users.repository';
import { PrismaUsersRepository } from './infrastructure/persistence/prisma-users.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaUsersRepository,
    { provide: USERS_REPOSITORY, useExisting: PrismaUsersRepository },
  ],
  exports: [USERS_REPOSITORY],
})
export class UsersModule {}
