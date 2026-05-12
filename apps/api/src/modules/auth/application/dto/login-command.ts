export type LoginCommand = {
  readonly email: string;
  readonly password: string;
  readonly userAgent?: string;
  readonly ipAddress?: string;
};
