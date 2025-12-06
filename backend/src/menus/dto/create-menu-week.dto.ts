
import { IsEnum, IsInt, IsArray, ValidateNested, IsOptional, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PhaseType } from '@prisma/client';

class MenuDayDto {
    @IsInt()
    @Min(1)
    @Max(7)
    jourNumero: number;

    @IsString()
    @IsOptional()
    petitDejeunerId?: string;

    @IsString()
    @IsOptional()
    dejeunerId?: string;

    @IsString()
    @IsOptional()
    dinerId?: string;
}

export class CreateMenuWeekDto {
    @IsEnum(PhaseType)
    phase: PhaseType;

    @IsInt()
    @Min(1)
    semaineNumero: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MenuDayDto)
    days: MenuDayDto[];
}
