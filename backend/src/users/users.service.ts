import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { WeighInsService } from '../weigh-ins/weigh-ins.service';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
        private subscriptionsService: SubscriptionsService,
        private weighInsService: WeighInsService,
    ) { }

    async getUserOverview(userId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) return null;

        const { passwordHash, ...userInfo } = user;

        const [activeSubscription, programStatus, weightStats] = await Promise.all([
            this.subscriptionsService.findActiveSubscriptionForUser(userId),
            this.subscriptionsService.getCurrentProgramStatusForUser(userId),
            this.weighInsService.getWeighInStats(userId),
        ]);

        return {
            user: userInfo,
            activeSubscription,
            programStatus,
            weightStats,
        };
    }

    async findOne(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(data.passwordHash, salt);

        return this.prisma.user.create({
            data: {
                ...data,
                passwordHash,
            },
        });
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<any[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.user.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                tailleCm: true,
                passwordHash: false, // Exclude password
            } as any, // Cast to any to avoid strict select typing issues if needed, or refine type
        });
    }

    async updateRole(id: string, role: any): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data: { role },
        });
    }

    async findByIdWithDetails(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                subscriptions: {
                    orderBy: { endDate: 'desc' },
                },
                weighIns: {
                    orderBy: { date: 'desc' },
                    take: 1,
                },
            },
        });

        if (!user) return null;

        // Strip password
        const { passwordHash, ...result } = user;
        return result;
    }
}

