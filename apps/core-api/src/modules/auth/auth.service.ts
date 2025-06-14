import {
  Body,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDTO } from './dto/signIn.dto';
import { UserService } from './users/users.service';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/shared/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { VerifyOTPdto } from './dto/verifyOtp.dto';
import { TwoFactorAuthService } from './twoFactorAuth/twoFactorAuth.service';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10', 10);

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: MailService,
    private readonly jwtService: JwtService,
    private readonly twoFactorAuthService: TwoFactorAuthService,
  ) {}

  private async generateOTP(email: string) {
    const OTP = Math.floor(100000 + Math.random() * 900000).toString();

    const OTPlist = await this.userService.CheckIfOtpexists(email, OTP);

    if (OTPlist.length > 0) {
      throw new ConflictException(
        'There has been a conflict when generating a otp! Please try again.',
      );
    }

    return OTP;
  }

  private generateHTML(otp: string) {
    return `
        <div style="font-family: Arial, sans-serif; text-align: center; max-width: 400px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333;">Your OTP Code</h2>
            <p style="color: #555;">Please use the following OTP to complete your verification:</p>
            <div style="font-size: 32px; font-weight: bold; margin: 10px 0; color: #007bff;">${otp}</div>
            <p style="color: #555;">If you did not request this, please ignore this email.</p>
            <div style="margin-top: 20px; font-size: 12px; color: #888;">&copy; 2025 Al nubras INC</div>
        </div>
    `;
  }

  async signIn(signInDTO: SignInDTO) {
    const user = await this.userService.findOneByEmail(signInDTO.email);

    if (!user) {
      throw new NotFoundException('user with this email does not exist');
    }
    
    // const passCompare = await bcrypt.compare(signInDTO.password, user.password);
    // if (!passCompare) {
    //   throw new UnauthorizedException("Invalid credentials! Please try again.")
    // }

    const OTP = await this.generateOTP(user.email);
    const OTPhtml = this.generateHTML(OTP);
    await this.emailService.sendMail({
      subject: 'Your OTP code for nubras ERP',
      html: OTPhtml,
      to: user.email,
    });
    await this.userService.saveOTP(user.email, OTP);

    return {
      message: `OTP has been sent to ${user.email}! Please check your email.`,
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOTPdto) {
    const otps = await this.userService.CheckIfOtpexists(
      verifyOtpDto.email,
      verifyOtpDto.otp,
    );

    // 2) Use the first record
    const otpRecord = otps[0];

    if (!otpRecord) {
      throw new NotFoundException('OTP is incorrect! Please try again');
    }

    // 3) Compare expiration
    const now = new Date();
    if (otpRecord.expiresIn < now) {
      throw new UnauthorizedException(
        'OTP has expired. Please request a new one.',
      );
    }

    await this.userService.deleteOTP(otpRecord.id);
    const userData = await this.userService.findUserWithRole(otpRecord.email);
    if (!userData) {
      throw new NotFoundException('User with this email does not exist!');
    }

    const payload = {
      sub: userData.user.id,
      profile: {
        email: userData.user.email,
        createdAt: userData.user.createdAt,
      },
      role: userData.role.name,
      permissions: userData.role.permissions,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });
    await this.StoreRefreshToken(userData.user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  private async StoreRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(
      refreshToken.toString(),
      SALT_ROUNDS,
    );

    await this.userService.StoreRefreshToken(hashedRefreshToken, userId);
  }

  async refreshToken(accesToken: string) {}

  async setUp2fa(email: string) {
    const secret = this.twoFactorAuthService.generateSecret(email);

    // Save the secret to user's profile (simulated)
    await this.userService.Store2faToken(email, secret.base32);

    const otpAuthUrl = `otpauth://totp/alnubras:${email}?secret=${secret.base32}&issuer=alnubras`;
    const qrCodeImage = await qrcode.toDataURL(otpAuthUrl);
    return { secret, qrCodeImage };
  }

  async verify2FA(email: string, otp: string) {
    // Fetch user data (simulation)
    const userData = await this.userService.findUserWithRole(email);

    if (!userData.user.twoFactorEnabled) {
      throw new UnauthorizedException('2FA is not enabled for this account.');
    }

    console.log(userData.user.twoFactorSecret);
    const isValid = this.twoFactorAuthService.verifyToken(
      userData.user.twoFactorSecret,
      otp,
    );

    if (!isValid) {
      throw new UnauthorizedException(
        'Invalid 2FA code. Please check again and come back!',
      );
    }

    const payload = {
      sub: userData.user.id,
      profile: {
        email: userData.user.email,
        createdAt: userData.user.createdAt,
      },
      role: userData.role.name,
      permissions: userData.role.permissions,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
