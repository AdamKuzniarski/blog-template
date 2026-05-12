export const HASHING_SERVICE = Symbol('HASHING_SERVICE');

export interface HashingService {
  hash(value: string): Promise<string>;
  compare(value: string, hashedValue: string): Promise<boolean>;
}
