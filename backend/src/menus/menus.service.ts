
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMenuWeekDto } from './dto/create-menu-week.dto';
import { UpdateMenuWeekDto } from './dto/update-menu-week.dto';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { PhaseType } from '@prisma/client';

@Injectable()
export class MenusService {
    constructor(
        private prisma: PrismaService,
        private subscriptionsService: SubscriptionsService
    ) { }

    // --- ADMIN ---

    async create(data: CreateMenuWeekDto) {
        // Create MenuWeek and nested MenuDays
        return this.prisma.menuWeek.create({
            data: {
                phase: data.phase,
                semaineNumero: data.semaineNumero,
                days: {
                    create: data.days.map(day => ({
                        phase: data.phase,
                        semaineNumero: data.semaineNumero, // Redundant but in schema
                        jourNumero: day.jourNumero,
                        petitDejeunerId: day.petitDejeunerId,
                        dejeunerId: day.dejeunerId,
                        dinerId: day.dinerId,
                    }))
                }
            },
            include: { days: true }
        });
    }

    async findOneByPhaseAndWeek(phase: PhaseType, semaineNumero: number) {
        return this.prisma.menuWeek.findFirst({
            where: {
                phase,
                semaineNumero
            },
            include: {
                days: {
                    orderBy: { jourNumero: 'asc' },
                    include: {
                        petitDejeuner: true,
                        dejeuner: true,
                        diner: true
                    }
                }
            }
        });
    }

    async update(id: string, data: UpdateMenuWeekDto) {
        // Complex update: often better to delete/recreate days or handle carefully
        // For simplicity allow updating top level facts, but full day replacement is tricky in one go via Prisma update
        // If 'days' is provided, we might want to delete existing days and recreate them.

        // This is a simplified implementation. Proper one would diff the days.
        // Or simpler: The user provides the whole week structure again?

        // For now let's just update the main fields. Updating nested relations via simple properties is hard.
        // Assuming Admin UI sends full object.

        // Strategy: Transaction to delete old days and create new ones if 'days' is present.

        if (data.days) {
            const daysInput = data.days;
            return this.prisma.$transaction(async (prisma) => {
                // Delete old days
                await prisma.menuDay.deleteMany({
                    where: { menuWeekId: id }
                });

                // Update Week props
                const updated = await prisma.menuWeek.update({
                    where: { id },
                    data: {
                        phase: data.phase,
                        semaineNumero: data.semaineNumero,
                        days: {
                            create: daysInput.map(day => ({
                                phase: data.phase || PhaseType.DETOX,
                                semaineNumero: data.semaineNumero ?? 1, // Fallback if not provided in update
                                jourNumero: day.jourNumero,
                                petitDejeunerId: day.petitDejeunerId,
                                dejeunerId: day.dejeunerId,
                                dinerId: day.dinerId,
                            }))
                        }
                    },
                    include: { days: true }
                });
                return updated;
            });
        }

        return this.prisma.menuWeek.update({
            where: { id },
            data: {
                phase: data.phase,
                semaineNumero: data.semaineNumero,
            },
        });
    }

    async remove(id: string) {
        // Cascade delete should handle days if configured, otherwise delete days first
        // Prisma schema doesn't show onDelete: Cascade. 
        // We should delete days first manually.
        await this.prisma.menuDay.deleteMany({ where: { menuWeekId: id } });
        return this.prisma.menuWeek.delete({
            where: { id },
        });
    }

    // --- PUBLIC / USER ---

    async getCurrentMenuForUser(userId: string) {
        // 1. Get Program Status
        const status = await this.subscriptionsService.getCurrentProgramStatusForUser(userId);

        if (!status || !status.hasActiveSubscription || !status.phase || !status.weekInPhase) {
            return null; // Or throw specific error
        }

        // 2. Find Menu for this phase and week
        // Note: status.phase is string (or enum from service return), let's cast
        const menu = await this.findOneByPhaseAndWeek(
            status.phase as PhaseType,
            status.weekInPhase
        );

        return {
            status,
            menu
        };
    }
}
