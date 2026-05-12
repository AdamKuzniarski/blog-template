import type { AuthenticatedUserDto } from './authenticated-user.dto';

export type LoginResponseDto = {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly user: AuthenticatedUserDto;
};
