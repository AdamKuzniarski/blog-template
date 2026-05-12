import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { LoginUseCase } from '../application/login.use-case';
import type { LoginCommand } from '../application/dto/login-command';
import type { LoginResponseDto } from './dto/login-response.dto';
import { LoginRequestDto } from './dto/login-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: LoginRequestDto,
    @Req() request: Request,
  ): Promise<LoginResponseDto> {
    const userAgent = normalizeHeaderValue(request.headers['user-agent']);
    const ipAddress = request.ip;

    const command: LoginCommand = {
      email: body.email,
      password: body.password,
      ...(userAgent !== undefined ? { userAgent } : {}),
      ...(ipAddress !== undefined ? { ipAddress } : {}),
    };

    return this.loginUseCase.execute(command);
  }
}
function normalizeHeaderValue(
  value: string | string[] | undefined,
): string | undefined {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    return value[0];
  }

  return undefined;
}
