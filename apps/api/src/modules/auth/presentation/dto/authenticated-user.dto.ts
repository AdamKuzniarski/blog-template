export type AuthenticatedUserDto = {
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly role: string;
};
