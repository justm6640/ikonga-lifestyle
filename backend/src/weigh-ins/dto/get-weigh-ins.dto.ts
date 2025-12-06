
import { IsOptional, IsIn } from 'class-validator';

export class GetWeighInsQueryDto {
    @IsOptional()
    @IsIn(['7d', '30d', 'all'])
    period?: '7d' | '30d' | 'all';
}
