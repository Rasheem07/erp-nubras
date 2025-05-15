import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from './users/users.service';
import { MailService } from 'src/shared/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDTO } from './dto/signIn.dto';
import { VerifyOTPdto } from './dto/verifyOtp.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userService: Partial<Record<keyof UserService, jest.Mock>>;
  let mailService: Partial<Record<keyof MailService, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;

  beforeEach(async () => {
    userService = {
      findOneByEmail: jest.fn(),
      CheckIfOtpexists: jest.fn(),
      saveOTP: jest.fn(),
      deleteOTP: jest.fn(),
      findUserWithRole: jest.fn(),
      StoreRefreshToken: jest.fn(),
    };
    mailService = {
      sendMail: jest.fn(),
    };
    jwtService = {
      signAsync: jest.fn().mockResolvedValue('token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: MailService, useValue: mailService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  describe('SignIn', () => {
    const dto: SignInDTO = { email: 'a@b.com', password: 'secret' };

    it('throws when password does not match', async () => {
      userService.findOneByEmail!.mockResolvedValue({ email: dto.email, password: 'wrong' });
      await expect(service.signIn(dto)).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('sends OTP, saves it, and returns message on success', async () => {
      userService.findOneByEmail!.mockResolvedValue({ email: dto.email, password: dto.password });
      userService.CheckIfOtpexists!.mockResolvedValue([]);
      const result = await service.signIn(dto);

      expect(userService.CheckIfOtpexists).toHaveBeenCalledWith(dto.email, expect.any(String));
      expect(mailService.sendMail).toHaveBeenCalledWith({
        to: dto.email,
        subject: expect.any(String),
        html: expect.any(String),
      });
      expect(userService.saveOTP).toHaveBeenCalledWith(dto.email, expect.any(String));
      expect(result).toContain(dto.email);
    });

    it('throws if OTP conflict', async () => {
      userService.findOneByEmail!.mockResolvedValue({ email: dto.email, password: dto.password });
      userService.CheckIfOtpexists!.mockResolvedValue([ { /* existing record */ } ]);
      await expect(service.signIn(dto)).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('verifyOtp', () => {
    const otpDto: VerifyOTPdto = { email: 'x@y.com', otp: '123456' };

    it('throws NotFound when no OTP record', async () => {
      userService.CheckIfOtpexists!.mockResolvedValue([]);
      await expect(service.verifyOtp(otpDto)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws Unauthorized when OTP expired', async () => {
      const past = new Date(Date.now() - 1000);
      userService.CheckIfOtpexists!.mockResolvedValue([{ id: 1, otp: otpDto.otp, expiresIn: past }]);
      await expect(service.verifyOtp(otpDto)).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('returns tokens on valid OTP and stores refresh', async () => {
      const future = new Date(Date.now() + 60_000);
      userService.CheckIfOtpexists!.mockResolvedValue([{ id: 1, otp: otpDto.otp, expiresIn: future }]);
      userService.findUserWithRole!.mockResolvedValue({
        user: { id: 42, email: otpDto.email, createdAt: new Date() },
        role: { name: 'user', permissions: ['read'] },
      });

      const tokens = await service.verifyOtp(otpDto);

      expect(userService.deleteOTP).toHaveBeenCalledWith(1);
      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(userService.StoreRefreshToken).toHaveBeenCalledWith(42, 'token');
      expect(tokens).toEqual({ accessToken: 'token', refreshToken: 'token' });
    });
  });
});
