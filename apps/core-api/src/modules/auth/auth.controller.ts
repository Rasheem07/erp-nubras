import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/signIn.dto';
import { VerifyOTPdto } from './dto/verifyOtp.dto';
import { Request, Response } from 'express';
import { UserService } from './users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signin')
  @HttpCode(200)
  async SignIn(@Body() signInDTO: SignInDTO) {
    return await this.authService.signIn(signInDTO);
  }

  @Post('verify')
  @HttpCode(200)
  async VerifyOtp(
    @Body() verifyOtpDto: VerifyOTPdto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.verifyOtp(verifyOtpDto);

    // Set HTTP-only cookies for security
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure only in production
      sameSite: 'lax',
      maxAge: 10 * 60 * 1000, // 1 hour
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({ message: 'OTP verified successfully' });
  }

  @Get('setup-2fa')
  async setup2FA(@Req() req: Request, @Res() res: Response) {
    const email = req.body.email;

    const { secret, qrCodeImage } = await this.authService.setUp2fa(email);

    res.json({ secret: secret.base32, qrCodeImage });
  }

  @Post('verify-2fa')
  async verify2FA(@Body() body: VerifyOTPdto, @Res() res: Response) {
    const { email, otp } = body;

    const { accessToken, refreshToken } = await this.authService.verify2FA(
      email,
      otp,
    );

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure only in production
      sameSite: 'lax',
      maxAge: 10 * 60 * 1000, //10 minutes
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({message: "OTP verified successfully!"})
  }
}
