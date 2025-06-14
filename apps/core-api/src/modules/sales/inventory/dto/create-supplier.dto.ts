import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSupplierDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsOptional()
    @IsString()
    location: string;

    @IsOptional()
    @IsString()
    email: string;
}