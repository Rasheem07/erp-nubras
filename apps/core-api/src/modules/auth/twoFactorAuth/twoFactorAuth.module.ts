import { Module } from "@nestjs/common";
import { TwoFactorAuthService } from "./twoFactorAuth.service";
import { UserModule } from "../users/user.module";

@Module({
    providers: [TwoFactorAuthService, UserModule],
    exports: [TwoFactorAuthService]
})
export class TwoFactorAuthModule {}