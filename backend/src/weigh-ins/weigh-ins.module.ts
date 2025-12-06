
import { Module } from '@nestjs/common';
import { WeighInsService } from './weigh-ins.service';
import { WeighInsController } from './weigh-ins.controller';
import { PrismaService } from '../prisma.service';

@Module({
    controllers: [WeighInsController],
    providers: [WeighInsService, PrismaService],
    exports: [WeighInsService],
})
export class WeighInsModule { }
