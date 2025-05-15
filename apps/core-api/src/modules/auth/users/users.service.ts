import { Injectable, NotFoundException } from '@nestjs/common';
import { OtpsRepo, RefreshTokensRepo, UsersRepo } from './user.repo';
import { otps, roles, users } from 'src/core/drizzle/schema';

@Injectable()
export class UserService {

    constructor(
        private readonly userRepo: UsersRepo,
        private readonly otpsRepo: OtpsRepo,
        private readonly refreshTokensRepo: RefreshTokensRepo
    ) { }

    async findOneByEmail(email: string) {
        const user = await this.userRepo.findByEmail(email);
        if (!user) {
            throw new NotFoundException("User with this email not found!");
        }
        return user[0];
    }

    async findUserWithRole(email: string) {
        const result = await this.userRepo.findUserWithRoles(email);
        return { user: result.users, role: result.roles};
    }

    async CheckIfOtpexists(email: string, otp: string) {
        return await this.otpsRepo.CheckIfOtpExists(email, otp);
    }


    async saveOTP(email: string, otp: string) {
        return await this.otpsRepo.create(email, otp);
    }

    async deleteOTP(id: number) {
        return await this.otpsRepo.deleteAfterSuccess(id);
    }

    async StoreRefreshToken(tokenHash: string, userId: number) {
        return await this.refreshTokensRepo.StoreRefreshToken(tokenHash, userId)
    }

    async Store2faToken(email: string, token: string){
        return await this.userRepo.enableAndStoreTotpSecret(email, token)
    }
}
