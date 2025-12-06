import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Subscription, SubscriptionStatus, SubscriptionType, PhaseType, PhaseSession } from '@prisma/client';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { AssignSubscriptionDto } from './dto/assign-subscription.dto';
import { ConfigService } from '@nestjs/config';

type SubscriptionWithPhases = Subscription & { phaseSessions: PhaseSession[] };

const SUBSCRIPTION_PHASE_CONFIG: Record<SubscriptionType, { pattern: { phase: PhaseType; weeks: number }[] }> = {
    STANDARD6: {
        pattern: [
            { phase: PhaseType.DETOX, weeks: 2 },
            { phase: PhaseType.EQUILIBRE, weeks: 4 },
        ],
    },
    STANDARD12: {
        // 2 cycles de STANDARD6
        pattern: [
            { phase: PhaseType.DETOX, weeks: 2 },
            { phase: PhaseType.EQUILIBRE, weeks: 4 },
            { phase: PhaseType.DETOX, weeks: 2 },
            { phase: PhaseType.EQUILIBRE, weeks: 4 },
        ],
    },
    STANDARD24: {
        // 4 cycles de STANDARD6
        pattern: [
            { phase: PhaseType.DETOX, weeks: 2 },
            { phase: PhaseType.EQUILIBRE, weeks: 4 },
            { phase: PhaseType.DETOX, weeks: 2 },
            { phase: PhaseType.EQUILIBRE, weeks: 4 },
            { phase: PhaseType.DETOX, weeks: 2 },
            { phase: PhaseType.EQUILIBRE, weeks: 4 },
            { phase: PhaseType.DETOX, weeks: 2 },
            { phase: PhaseType.EQUILIBRE, weeks: 4 },
        ],
    },
    STANDARD48: {
        // 8 cycles de STANDARD6
        pattern: [
            { phase: PhaseType.DETOX, weeks: 2 },
            { phase: PhaseType.EQUILIBRE, weeks: 4 },
            { phase: PhaseType.DETOX, weeks: 2 },
            { phase: PhaseType.EQUILIBRE, weeks: 4 },
            { phase: PhaseType.DETOX, weeks: 2 },
            { phase: PhaseType.EQUILIBRE, weeks: 4 },
            { phase: PhaseType.DETOX, weeks: 2 },
            { phase: PhaseType.EQUILIBRE, weeks: 4 },
            { phase: PhaseType.DETOX, weeks: 2 },
            { phase: PhaseType.EQUILIBRE, weeks: 4 },
            { phase: PhaseType.DETOX, weeks: 2 },
            { phase: PhaseType.EQUILIBRE, weeks: 4 },
            { phase: PhaseType.DETOX, weeks: 2 },
            { phase: PhaseType.EQUILIBRE, weeks: 4 },
            { phase: PhaseType.DETOX, weeks: 2 },
            { phase: PhaseType.EQUILIBRE, weeks: 4 },
        ],
    },
    VIP12: {
        // 2 cycles de 3D + 3E
        pattern: [
            { phase: PhaseType.DETOX, weeks: 3 },
            { phase: PhaseType.EQUILIBRE, weeks: 3 },
            { phase: PhaseType.DETOX, weeks: 3 },
            { phase: PhaseType.EQUILIBRE, weeks: 3 },
        ],
    },
    VIPPP16: {
        // 3D + 3E + 3D + 3E + 4 semaines de phase finale
        pattern: [
            { phase: PhaseType.DETOX, weeks: 3 },
            { phase: PhaseType.EQUILIBRE, weeks: 3 },
            { phase: PhaseType.DETOX, weeks: 3 },
            { phase: PhaseType.EQUILIBRE, weeks: 3 },
            // la phase finale sera injectée dynamiquement
        ],
    },
};

@Injectable()
export class SubscriptionsService {
    constructor(private prisma: PrismaService, private configService: ConfigService) { }

    async createSubscriptionForUser(data: CreateSubscriptionDto): Promise<Subscription> {
        // 1. Create the subscription properly
        const subscription = await this.prisma.subscription.create({
            data: {
                userId: data.userId,
                type: data.type,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                status: SubscriptionStatus.ACTIVE,
            },
        });

        // 2. Generate phases automatically based on type
        const finalEndDate = await this.generatePhaseSessionsForSubscription(subscription);

        // 3. Update subscription endDate if calculated date is different
        // Only update if calculate date > original date or if we want exact precision
        if (finalEndDate.getTime() !== subscription.endDate.getTime()) {
            return this.prisma.subscription.update({
                where: { id: subscription.id },
                data: { endDate: finalEndDate },
            });
        }

        return subscription;
    }

    /**
     * Assign a subscription to a user (ADMIN only).
     * Validates that the user does not have an active subscription.
     * Automatically calculates endDate based on subscription type.
     */
    async assignSubscriptionToUser(data: AssignSubscriptionDto): Promise<Subscription> {
        // 1. Verify user exists
        const user = await this.prisma.user.findUnique({
            where: { id: data.userId },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${data.userId} not found`);
        }

        // 2. Check for existing ACTIVE subscription
        const existingActiveSubscription = await this.findActiveSubscriptionForUser(data.userId);

        if (existingActiveSubscription) {
            throw new BadRequestException(
                `Cet utilisateur a déjà un abonnement actif. Il faut d’abord le terminer ou le supprimer avant d’en créer un nouveau.`
            );
        }

        // 3. Calculate endDate based on subscription type
        const startDateObj = new Date(data.startDate);
        const durationWeeks = this.getSubscriptionDurationInWeeks(data.type);
        const endDateObj = new Date(startDateObj);
        endDateObj.setDate(endDateObj.getDate() + (durationWeeks * 7) - 1);

        // 4. Create subscription with calculated endDate
        return this.createSubscriptionForUser({
            userId: data.userId,
            type: data.type,
            startDate: data.startDate,
            endDate: endDateObj.toISOString().split('T')[0], // Convert to YYYY-MM-DD
        });
    }

    /**
     * Delete a subscription and its associated phase sessions (via Cascade).
     */
    async deleteSubscription(subscriptionId: string): Promise<Subscription> {
        const subscription = await this.prisma.subscription.findUnique({
            where: { id: subscriptionId },
        });

        if (!subscription) {
            throw new NotFoundException(`Subscription with ID ${subscriptionId} not found`);
        }

        // Optional: Check status before deleting if we wanted to restrict deletion of ACTIVE subs
        // For V1, we allow deletion anytime.

        return this.prisma.subscription.delete({
            where: { id: subscriptionId },
        });
    }

    /**
     * Get the duration in weeks for a given subscription type.
     */
    private getSubscriptionDurationInWeeks(type: SubscriptionType): number {
        const durationMap: Record<SubscriptionType, number> = {
            STANDARD6: 6,
            STANDARD12: 12,
            STANDARD24: 24,
            STANDARD48: 48,
            VIP12: 12,
            VIPPP16: 16,
        };

        return durationMap[type];
    }

    async listSubscriptionsForUser(userId: string): Promise<SubscriptionWithPhases[]> {
        return this.prisma.subscription.findMany({
            where: { userId },
            include: { phaseSessions: { orderBy: { startDate: 'asc' } } },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findActiveSubscriptionForUser(userId: string): Promise<SubscriptionWithPhases | null> {
        return this.prisma.subscription.findFirst({
            where: {
                userId,
                status: SubscriptionStatus.ACTIVE,
            },
            include: { phaseSessions: { orderBy: { startDate: 'asc' } } },
        });
    }

    /**
     * Generates PhaseSessions based on SubscriptionType.
     * Returns the calculated end date of the last phase.
     */
    private async generatePhaseSessionsForSubscription(subscription: Subscription): Promise<Date> {
        const { type, startDate } = subscription;
        const config = SUBSCRIPTION_PHASE_CONFIG[type];

        if (!config) {
            return subscription.endDate;
        }

        let phases = [...config.pattern];

        // Specific handling for VIPPP16
        if (type === SubscriptionType.VIPPP16) {
            const finalPhaseStr = this.configService.get<string>('phase_finale_vippp') || 'EQUILIBRE';
            let finalPhase: PhaseType = PhaseType.EQUILIBRE;
            // PhaseType is enum { DETOX, EQUILIBRE, ... }
            if (finalPhaseStr === 'DETOX') finalPhase = PhaseType.DETOX;

            phases.push({ phase: finalPhase, weeks: 4 });
        }

        let currentStartDate = new Date(startDate);
        let lastEndDate = new Date(startDate);

        for (const phaseConfig of phases) {
            // Calculate endDate for this phase
            const durationDays = phaseConfig.weeks * 7;
            const phaseEndDate = new Date(currentStartDate);
            phaseEndDate.setDate(phaseEndDate.getDate() + durationDays);

            // Create PhaseSession
            await this.prisma.phaseSession.create({
                data: {
                    subscriptionId: subscription.id,
                    phase: phaseConfig.phase,
                    startDate: currentStartDate,
                    endDate: phaseEndDate,
                },
            });

            currentStartDate = phaseEndDate;
            lastEndDate = phaseEndDate;
        }

        return lastEndDate;
    }

    async getCurrentProgramStatusForUser(userId: string, today: Date = new Date()) {
        const subscription = await this.findActiveSubscriptionForUser(userId);

        if (!subscription) {
            return {
                hasActiveSubscription: false,
                phase: null,
                dayInPhase: null,
                weekInPhase: null,
                dayInProgram: null,
            };
        }

        const startDate = new Date(subscription.startDate);
        // Calculate day in program (1-based)
        const dayInProgram = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        if (dayInProgram < 1) {
            return {
                hasActiveSubscription: true,
                phase: null, // Not started yet
                dayInPhase: null,
                weekInPhase: null,
                dayInProgram,
            };
        }

        // Find current phase
        let currentPhase: string | null = null;
        let dayInPhase: number | null = null;
        let weekInPhase: number | null = null;

        for (const session of subscription.phaseSessions) {
            const phaseStart = new Date(session.startDate);
            const phaseEnd = new Date(session.endDate);

            if (today >= phaseStart && today < phaseEnd) {
                currentPhase = session.phase;
                const diffTime = today.getTime() - phaseStart.getTime();
                dayInPhase = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
                weekInPhase = Math.ceil(dayInPhase / 7);
                break;
            }
        }

        // Check if finished
        if (!currentPhase && dayInProgram > 0) {
            const endDate = new Date(subscription.endDate);
            if (today >= endDate) {
                return {
                    hasActiveSubscription: true,
                    phase: null, // Finished
                    dayInPhase: null,
                    weekInPhase: null,
                    dayInProgram,
                    isFinished: true // Optional flag
                };
            }
        }

        return {
            hasActiveSubscription: true,
            phase: currentPhase,
            dayInPhase,
            weekInPhase,
            dayInProgram,
        };
    }

    async findAll(params: {
        userId?: string;
        status?: SubscriptionStatus;
    }): Promise<Subscription[]> {
        const { userId, status } = params;
        return this.prisma.subscription.findMany({
            where: {
                userId,
                status,
            },
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { email: true, firstName: true, lastName: true } } }
        });
    }

    async updateStatus(id: string, status: SubscriptionStatus): Promise<Subscription> {
        let updateData: any = { status };

        // If ending subscription, cap end date to now if it was in the future
        if (status === SubscriptionStatus.ENDED) {
            const currentSub = await this.prisma.subscription.findUnique({ where: { id } });
            if (currentSub && currentSub.endDate > new Date()) {
                updateData.endDate = new Date();
            }
        }

        return this.prisma.subscription.update({
            where: { id },
            data: updateData,
        });
    }
}
