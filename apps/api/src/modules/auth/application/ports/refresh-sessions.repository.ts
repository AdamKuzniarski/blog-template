export const REFRESH_SESSIONS_REPOSITORY = Symbol(
  'REFRESH_SESSIONS_REPOSITORY',
);

export type CreateRefreshSessionInput = {
  readonly id: string;
  readonly userId: string;
  readonly tokenHash: string;
  readonly expiresAt: Date;
  readonly userAgent?: string;
  readonly ipAddress?: string;
};

export interface RefreshRepository {
  create(input: CreateRefreshSessionInput): Promise<void>;
}
