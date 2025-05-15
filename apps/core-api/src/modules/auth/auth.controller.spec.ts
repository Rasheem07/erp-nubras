import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService }    from './auth.service';
import { SignInDTO }      from './dto/signIn.dto';
import { VerifyOTPdto }   from './dto/verifyOtp.dto';
import { Res } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: Partial<Record<keyof AuthService, jest.Mock>>;

  beforeEach(async () => {
    authService = {
      signIn: jest.fn().mockResolvedValue('ok'),
      verifyOtp: jest.fn().mockResolvedValue({ accessToken: 'a', refreshToken: 'b' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get(AuthController);
  });

  it('SignIn calls AuthService.SignIn', async () => {
    const dto: SignInDTO = { email: 'u@e.com', password: 'p' };
    const res = await controller.SignIn(dto);
    expect(authService.signIn).toHaveBeenCalledWith(dto);
    expect(res).toBe('ok');
  });

  // it('VerifyOtp calls AuthService.verifyOtp', async () => {
  //   const dto: VerifyOTPdto = { email: 'x@y.com', otp: '123456' };
  //   const res = await controller.VerifyOtp(dto, @Res());
  //   expect(authService.verifyOtp).toHaveBeenCalledWith(dto);
  //   expect(res).toEqual({ accessToken: 'a', refreshToken: 'b' });
  // });
});
