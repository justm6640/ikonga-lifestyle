
import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWeighInDto {
    @IsOptional()
    @IsDateString()
    date?: string;

    @IsNumber()
    @Min(0)
    weightKg: number;

    @IsOptional()
    @IsString()
    note?: string;
}
