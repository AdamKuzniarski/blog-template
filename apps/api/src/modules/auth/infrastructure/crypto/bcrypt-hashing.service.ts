import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import type { HashingService } from '../../application/ports/hashing.service';

@Injectable()
export class BcryptHashingService implements HashingService {
  async hash(value: string): Promise<string> {
    return hash(value, 12);
  }

  compare(value: string, hashedValue: string): Promise<boolean> {
    return compare(value, hashedValue);
  }
}
