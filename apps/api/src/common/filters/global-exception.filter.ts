import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { ApiErrorResponse } from '../http/api-error-response';

type HttpRequest = {
  readonly method: string;
  readonly url: string;
};

type HttpResponse = {
  status(code: number): {
    json(body: unknown): void;
  };
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<HttpRequest>();
    const response = context.getResponse<HttpResponse>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = this.buildErrorResponse(
      exception,
      statusCode,
      request,
    );

    response.status(statusCode).json(errorResponse);
  }

  private buildErrorResponse(
    exception: unknown,
    statusCode: number,
    request: HttpRequest,
  ): ApiErrorResponse {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const { error, message } = this.extractHttpExceptionPayload(
        response,
        statusCode,
      );

      return {
        statusCode,
        error,
        message,
        path: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      statusCode,
      error: 'Internal Server Error',
      message: 'Internal server error',
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    };
  }

  private extractHttpExceptionPayload(
    response: string | object,
    statusCode: number,
  ): Pick<ApiErrorResponse, 'error' | 'message'> {
    if (typeof response === 'string') {
      return {
        error: this.formatHttpStatusName(statusCode),
        message: response,
      };
    }

    if (this.isRecord(response)) {
      const error =
        typeof response.error === 'string'
          ? response.error
          : this.formatHttpStatusName(statusCode);

      const message = this.extractMessage(response.message);

      return {
        error,
        message,
      };
    }

    return {
      error: this.formatHttpStatusName(statusCode),
      message: 'Unexpected error',
    };
  }

  private extractMessage(value: unknown): string | readonly string[] {
    if (typeof value === 'string') {
      return value;
    }

    if (
      Array.isArray(value) &&
      value.every((item) => typeof item === 'string')
    ) {
      return value;
    }

    return 'Unexpected error';
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private formatHttpStatusName(statusCode: number): string {
    const enumValue = HttpStatus[statusCode];

    if (typeof enumValue !== 'string') {
      return 'Error';
    }

    return enumValue
      .split(' ')
      .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
      .join(' ');
  }
}
