import { Role } from '../../../generated/prisma/client';

export type User = {
  readonly id: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly name: string | null;
  readonly role: Role;
  readonly cratedAt: Date;
  readonly updatedAt: Date;
};
