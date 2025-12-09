
import { IsOptional, IsIn } from 'class-validator';

export class GetWeighInsQueryDto {
    @IsOptional()
    @IsIn(['3d', '7d', '30d', 'all', 'custom'])
    period?: '3d' | '7d' | '30d' | 'all' | 'custom';

    @IsOptional()
    // @IsDateString() - Removed strict validation for leniency or add import if needed, but IsOptional is key
    startDate?: string;

    @IsOptional()
    endDate?: string;
}
