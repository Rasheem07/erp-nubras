import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.cookies['access_token'];
      const refreshToken = req.cookies['refresh_token'];

      // 🌟 Case 1: Missing Access Token
      if (!accessToken) {
        if (!refreshToken) {
          this.clearCookies(res);
          throw new UnauthorizedException('Session expired. Please log in again.');
        }
        // Attempt to refresh the token if only the access token is missing
        return await this.handleTokenRefresh(refreshToken, req, res, next);
      }

      try {
        // ✅ Verify Access Token
        const payload = this.jwtService.verify(accessToken, { secret: process.env.JWT_SECRET });
        req['user'] = payload;

        // Check if the refresh token needs to be refreshed as well (1 day before expiry)
        const refreshPayload = this.jwtService.decode(refreshToken) as { exp: number };
        const expiresIn = refreshPayload.exp - Math.floor(Date.now() / 1000);

        if (expiresIn < 86400) { // 1 day = 86400 seconds
          await this.refreshBothTokens(req, res, refreshPayload);
        }

        return next();
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          // 🌟 Case 3: Expired Access Token
          if (!refreshToken) {
            this.clearCookies(res);
            throw new UnauthorizedException('Session expired. Please log in again.');
          }
          return await this.handleTokenRefresh(refreshToken, req, res, next);
        } else {
          // 🌟 Case 2: Invalid Access Token
          this.clearCookies(res);
          throw new UnauthorizedException('Invalid access token. Please log in again.');
        }
      }
    } catch (error) {
      return next(error);
    }
  }

  private async handleTokenRefresh(refreshToken: string, req: Request, res: Response, next: NextFunction) {
    try {
      // ✅ Verify Refresh Token
      const refreshPayload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_SECRET });

      // Refresh both tokens if the refresh token is about to expire within a day
      const expiresIn = refreshPayload.exp - Math.floor(Date.now() / 1000);
      if (expiresIn < 86400) { // 1 day = 86400 seconds
        await this.refreshBothTokens(req, res, refreshPayload);
      } else {
        // Only refresh the access token
        const newAccessToken = this.generateAccessToken(refreshPayload);
        this.setAccessTokenCookie(res, newAccessToken);
        req.cookies['access_token'] = newAccessToken;
        req['user'] = this.jwtService.decode(newAccessToken);
      }

      return next();
    } catch (err) {
      // 🌟 Case 4 & 5: Missing or Invalid Refresh Token
      this.clearCookies(res);
      throw new UnauthorizedException('Session expired or invalid refresh token. Please log in again.');
    }
  }

  // 🔄 Refresh both access and refresh tokens
  private async refreshBothTokens(req: Request, res: Response, refreshPayload: any) {
    const newAccessToken = this.generateAccessToken(refreshPayload);
    const newRefreshToken = this.generateRefreshToken(refreshPayload);

    // 🍪 Update cookies
    this.setAccessTokenCookie(res, newAccessToken);
    this.setRefreshTokenCookie(res, newRefreshToken);

    req.cookies['access_token'] = newAccessToken;
    req.cookies['refresh_token'] = newRefreshToken;
    req['user'] = this.jwtService.decode(newAccessToken);
  }

  // 🛠️ Generate Access Token
  private generateAccessToken(payload: any): string {
    return this.jwtService.sign(
      { sub: payload.sub, profile: payload.profile, role: payload.role, permessions: payload.permissions },
      { expiresIn: '10m' }
    );
  }

  // 🛠️ Generate Refresh Token
  private generateRefreshToken(payload: any): string {
    return this.jwtService.sign(
        { sub: payload.sub, profile: payload.profile, role: payload.role, permessions: payload.permissions },
      { expiresIn: '7d' }
    );
  }

  // 🍪 Set Access Token Cookie
  private setAccessTokenCookie(res: Response, token: string) {
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60 * 1000, // 10 minutes
    });
  }

  // 🍪 Set Refresh Token Cookie
  private setRefreshTokenCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  // 🧹 Clear cookies when authentication fails
  private clearCookies(res: Response) {
    res.clearCookie('access_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.clearCookie('refresh_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  }
}
