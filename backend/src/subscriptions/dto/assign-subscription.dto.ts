import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SubscriptionType } from '@prisma/client';

export class AssignSubscriptionDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsEnum(SubscriptionType)
    type: SubscriptionType;

    @IsString()
    @IsNotEmpty()
    startDate: string; // Format ISO YYYY-MM-DD (endDate will be auto-calculated)
}

