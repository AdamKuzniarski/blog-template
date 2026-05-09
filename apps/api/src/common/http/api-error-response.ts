export type ApiErrorResponse = {
  readonly statusCode: number;
  readonly error: string;
  readonly message: string | readonly string[];
  readonly path: string;
  readonly method: string;
  readonly timestamp: string;
};
