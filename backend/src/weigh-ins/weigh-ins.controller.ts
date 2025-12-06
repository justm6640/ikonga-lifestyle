
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { WeighInsService } from './weigh-ins.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '@prisma/client'; // Assuming types are clean
import { CreateWeighInDto } from './dto/create-weigh-in.dto';
import { GetWeighInsQueryDto } from './dto/get-weigh-ins.dto';
import type { User as UserType } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('weigh-ins')
export class WeighInsController {
    constructor(private weighInsService: WeighInsService) { }

    @Post()
    create(@GetUser() user: UserType, @Body() data: CreateWeighInDto) {
        return this.weighInsService.createWeighIn(user.id, data);
    }

    @Get()
    findAll(@GetUser() user: UserType, @Query() query: GetWeighInsQueryDto) {
        return this.weighInsService.getWeighIns(user.id, query);
    }

    @Get('stats')
    getStats(@GetUser() user: UserType) {
        return this.weighInsService.getWeighInStats(user.id);
    }

    @Get('last-7-days')
    getLast7Days(@GetUser() user: UserType) {
        return this.weighInsService.getLast7Days(user.id);
    }
}
