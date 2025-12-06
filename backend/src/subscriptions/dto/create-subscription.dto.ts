
import { IsNotEmpty, IsString, IsEnum, IsDateString } from 'class-validator';
import { SubscriptionType } from '@prisma/client';

export class CreateSubscriptionDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsEnum(SubscriptionType)
    type: SubscriptionType;

    @IsNotEmpty()
    @IsDateString()
    startDate: string;

    @IsNotEmpty()
    @IsDateString()
    endDate: string;
}
