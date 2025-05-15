import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';

@Injectable()
export class TwoFactorAuthService {
  generateSecret(email: string) {
    return speakeasy.generateSecret({
      name: `alnubras ERP (${email})`,
      length: 20,
    });
  }

  verifyToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1,  // Allows for time drift
    });
  }
}
