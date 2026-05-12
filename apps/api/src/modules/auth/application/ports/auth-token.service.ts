import type { Role } from 'src/generated/prisma/enums';

export const AUTH_TOKEN_SERVICE = Symbol('AUTH_TOKEN_SERVICE');

export type AccessTokenPayload = {
  readonly sub: string;
  readonly sid: string;
  readonly role: Role;
  readonly type: 'access';
};

export type RefreshTokenPayload = {
  readonly sub: string;
  readonly sid: string;
  readonly type: 'refresh';
};

export interface AuthTokenService {
  signAccessToken(payload: AccessTokenPayload): Promise<string>;
  signRefreshToken(payload: RefreshTokenPayload): Promise<string>;
}
