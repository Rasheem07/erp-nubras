import { IsEmail, IsString, Length, length, max, min } from 'class-validator';

export class SignInDTO {
   @IsEmail()
   email: string;

   @IsString({message: "Password must be a string!"})
   @Length(8,12)
   password: string;
   
}