
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateWeighInDto } from './dto/create-weigh-in.dto';
import { GetWeighInsQueryDto } from './dto/get-weigh-ins.dto';

@Injectable()
export class WeighInsService {
    constructor(private prisma: PrismaService) { }

    async createWeighIn(userId: string, data: CreateWeighInDto) {
        let date = data.date ? new Date(data.date) : new Date();

        // Validation: Date shouldn't be in the future (tomorrow onwards)
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        if (date > todayEnd) {
            throw new BadRequestException('La date de la pesée ne peut pas être dans le futur.');
        }

        return this.prisma.weighIn.create({
            data: {
                userId,
                date: date,
                weightKg: data.weightKg,
                note: data.note,
            },
        });
    }


    async getWeighIns(userId: string, options?: GetWeighInsQueryDto) {
        const { period } = options || {};
        let afterDate: Date | undefined;

        if (period === '7d') {
            afterDate = new Date();
            afterDate.setDate(afterDate.getDate() - 7);
        } else if (period === '30d') {
            afterDate = new Date();
            afterDate.setDate(afterDate.getDate() - 30);
        }

        return this.prisma.weighIn.findMany({
            where: {
                userId,
                ...(afterDate ? { date: { gte: afterDate } } : {}),
            },
            orderBy: { date: 'asc' },
        });
    }

    async getWeighInStats(userId: string) {
        // Fetch user for height
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { tailleCm: true },
        });

        const lastWeighIn = await this.prisma.weighIn.findFirst({
            where: { userId },
            orderBy: { date: 'desc' },
        });

        if (!lastWeighIn) {
            return null;
        }

        const aggregates = await this.prisma.weighIn.aggregate({
            where: { userId },
            _min: { weightKg: true },
            _max: { weightKg: true },
        });

        // Calculate IMC (BMI)
        let imc: number | null = null;
        let imcCategory: string | null = null;

        if (user?.tailleCm && lastWeighIn.weightKg > 0) {
            const heightM = user.tailleCm / 100;
            // BMI = weight / (height * height)
            imc = parseFloat((lastWeighIn.weightKg / (heightM * heightM)).toFixed(1));

            if (imc < 18.5) {
                imcCategory = 'Insuffisance pondérale';
            } else if (imc < 25) {
                imcCategory = 'Poids normal';
            } else if (imc < 30) {
                imcCategory = 'Surpoids';
            } else {
                imcCategory = 'Obésité';
            }
        }

        return {
            lastWeightKg: lastWeighIn.weightKg,
            lastDate: lastWeighIn.date,
            minWeightKg: aggregates._min.weightKg,
            maxWeightKg: aggregates._max.weightKg,
            imc,
            imcCategory,
        };
    }
    async getLast7Days(userId: string) {
        const weighIns = await this.prisma.weighIn.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
            take: 7,
            select: {
                id: true,
                date: true,
                weightKg: true,
            },
        });

        // Reorder to chronological (ascending) and map weightKg -> value
        return weighIns
            .reverse()
            .map(w => ({
                id: w.id,
                date: w.date,
                value: w.weightKg,
            }));
    }
}
