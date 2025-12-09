
import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { WeighInsService } from './weigh-ins.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '@prisma/client';
import { CreateWeighInDto } from './dto/create-weigh-in.dto';
import { GetWeighInsQueryDto } from './dto/get-weigh-ins.dto';
import type { User as UserType } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@UseGuards(JwtAuthGuard)
@Controller('weigh-ins')
export class WeighInsController {
    constructor(private weighInsService: WeighInsService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/weigh-ins',
            filename: (req, file, callback) => {
                const uniqueSuffix = uuidv4() + extname(file.originalname);
                callback(null, uniqueSuffix);
            },
        }),
    }))
    create(@GetUser() user: UserType, @Body() data: CreateWeighInDto, @UploadedFile() file: Express.Multer.File) {
        // Transform weightKg from string to float if it comes from FormData
        const payload = {
            ...data,
            weightKg: typeof data.weightKg === 'string' ? parseFloat(data.weightKg) : data.weightKg,
            photoUrl: file ? `/uploads/weigh-ins/${file.filename}` : undefined,
        };
        return this.weighInsService.createWeighIn(user.id, payload);
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
