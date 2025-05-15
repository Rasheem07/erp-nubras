import { IsEmail, Length } from "class-validator";

export class VerifyOTPdto { 

    @IsEmail()
    email: string;

    @Length(1, 7)
    otp: string;
}