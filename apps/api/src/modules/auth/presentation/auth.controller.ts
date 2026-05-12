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
    return this.loginUseCase.execute({
      email: body.email,
      password: body.password,
      userAgent: normalizeHeaderValue(request.headers['user-agent']),
      ipAddress: request.ip,
    });
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
