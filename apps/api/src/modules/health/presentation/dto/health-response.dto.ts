export type HealthResponseDto = {
  readonly status: 'ok';
  readonly service: 'api';
  readonly database: 'up';
  readonly timestamp: string;
};
