import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginRequestDto {
  @IsEmail()
  readonly email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  readonly password!: string;
}
