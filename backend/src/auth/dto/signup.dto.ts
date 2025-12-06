
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsNumber } from 'class-validator';

export class SignupDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsOptional()
    @IsString()
    sexe?: string;

    @IsOptional()
    @IsString()
    paysOrigine?: string;

    @IsOptional()
    @IsString()
    paysResidence?: string;

    @IsOptional()
    @IsString()
    villeResidence?: string;

    @IsOptional()
    @IsString()
    dateNaissance?: string; // Format ISO string YYYY-MM-DD

    @IsOptional()
    @IsString()
    contact?: string;

    @IsOptional()
    @IsNumber()
    tailleCm?: number;
}
