import { Module } from '@nestjs/common';
import { OtpsRepo, RefreshTokensRepo, UsersRepo } from './user.repo';
import { UserService } from './users.service';

@Module({
    providers: [
        UsersRepo,
        OtpsRepo,
        RefreshTokensRepo,
        UserService
    ],
    exports: [UserService]
})
export class UserModule { }
