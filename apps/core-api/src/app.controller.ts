import { Controller, Get, Req, UseGuards } from '@nestjs/common';
// import { AuthGuard } from './modules/auth/auth.guard';
import { UserService } from './modules/auth/users/users.service';

@Controller()
export class AppController {
  constructor() { }

  @Get('me')
  getHello(@Req() req: Response) {
    return {
      id: req['user'].sub,
      email: req['user'].profile.email,
      createdAt: req['user'].profile.createdAt,
      role: req['user'].role,
      permissions: req['user'].permissions,
    };
  }
}
