
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PhaseType } from '@prisma/client';

export class IngredientDto {
    @IsString()
    ingredient: string;

    @IsNumber()
    quantity: number;

    @IsString()
    unit: string;

    @IsString()
    category: string;
}

export class CreateRecipeDto {
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => IngredientDto)
    ingredients: IngredientDto[];

    @IsArray()
    @IsString({ each: true })
    steps: string[];

    @IsNumber()
    @IsOptional()
    calories?: number;

    @IsEnum(PhaseType)
    phaseTag: PhaseType;
}
