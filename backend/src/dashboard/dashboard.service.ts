import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { DashboardKpiDto, MenuDuJourDto } from './dto/dashboard-kpi.dto';
import { PhaseType } from '@prisma/client';

@Injectable()
export class DashboardService {
    constructor(
        private prisma: PrismaService,
        private subscriptionsService: SubscriptionsService,
    ) { }

    async getDashboardForUser(userId: string): Promise<DashboardKpiDto> {
        // 1. Get latest weigh-in for current weight
        const lastWeighIn = await this.prisma.weighIn.findFirst({
            where: { userId },
            orderBy: { date: 'desc' },
        });
        const poidsActuel = lastWeighIn?.weightKg ?? null;

        // 2. Calculate total weight lost
        let poidsTotalPerdu: number | null = null;

        // Get initial weight (first weigh-in)
        const firstWeighIn = await this.prisma.weighIn.findFirst({
            where: { userId },
            orderBy: { date: 'asc' },
        });
        const poidsInitial = firstWeighIn?.weightKg ?? null;

        if (poidsInitial !== null && poidsActuel !== null) {
            poidsTotalPerdu = poidsInitial - poidsActuel;
        }

        // 3. Get current phase and day in phase
        const programStatus = await this.subscriptionsService.getCurrentProgramStatusForUser(userId);
        const phaseActuelle = programStatus.phase ?? null;
        const jourDansLaPhase = programStatus.dayInPhase ?? null;

        // 4. Get Menu of the Day
        let menuDuJour: MenuDuJourDto | null = null;

        if (phaseActuelle && jourDansLaPhase && Object.values(PhaseType).includes(phaseActuelle as PhaseType)) {
            // Calculate week and day numbers
            // Assumes dayInPhase starts at 1
            const semaineNumero = Math.ceil(jourDansLaPhase / 7);
            const jourNumero = ((jourDansLaPhase - 1) % 7) + 1;

            const dailyMenu = await this.prisma.menuDay.findFirst({
                where: {
                    phase: phaseActuelle as PhaseType,
                    semaineNumero: semaineNumero,
                    jourNumero: jourNumero,
                },
                include: {
                    petitDejeuner: true,
                    dejeuner: true,
                    diner: true,
                },
            });

            if (dailyMenu) {
                menuDuJour = {
                    petitDejeuner: dailyMenu.petitDejeuner?.title ?? null,
                    dejeuner: dailyMenu.dejeuner?.title ?? null,
                    diner: dailyMenu.diner?.title ?? null,
                    collation: null, // Not yet in database
                };
            }
        }

        return {
            poidsActuel,
            poidsTotalPerdu,
            phaseActuelle,
            jourDansLaPhase,
            menuDuJour,
        };
    }
}
