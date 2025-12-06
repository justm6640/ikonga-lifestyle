
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { PrismaService } from '../prisma.service';
import { SubscriptionType, PhaseType } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const subscriptionsService = app.get(SubscriptionsService);
    const prisma = app.get(PrismaService);
    const configService = app.get(ConfigService);

    console.log('--- Verification Script Started ---');

    // Create a dummy user for testing
    const testEmail = `verify_phases_${Date.now()}@test.com`;
    const user = await prisma.user.create({
        data: {
            email: testEmail,
            passwordHash: 'dummy',
        },
    });
    console.log(`Created test user: ${user.id}`);

    try {
        // 1. Verify STANDARD24
        console.log('\n--- Verifying STANDARD24 ---');
        const subStd24 = await subscriptionsService.createSubscriptionForUser({
            userId: user.id,
            type: SubscriptionType.STANDARD24 as any,
            startDate: new Date().toISOString(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString(),
        });

        const subStd24WithPhases = await subscriptionsService.findActiveSubscriptionForUser(user.id);
        if (!subStd24WithPhases) throw new Error('STANDARD24 subscription not found');

        console.log(`STANDARD24 generated ${subStd24WithPhases.phaseSessions.length} phases.`);
        subStd24WithPhases.phaseSessions.forEach((p, i) => {
            console.log(`Phase ${i + 1}: ${p.phase} (${p.startDate.toISOString().split('T')[0]} to ${p.endDate.toISOString().split('T')[0]})`);
        });

        // Cleanup active sub to create next one
        await prisma.subscription.update({ where: { id: subStd24.id }, data: { status: 'ENDED' } });


        // 2. Verify VIP12
        console.log('\n--- Verifying VIP12 ---');
        const subVip12 = await subscriptionsService.createSubscriptionForUser({
            userId: user.id,
            type: SubscriptionType.VIP12 as any,
            startDate: new Date().toISOString(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        });

        const subVip12WithPhases = await subscriptionsService.findActiveSubscriptionForUser(user.id);
        if (!subVip12WithPhases) throw new Error('VIP12 subscription not found');

        console.log(`VIP12 generated ${subVip12WithPhases.phaseSessions.length} phases.`);
        subVip12WithPhases.phaseSessions.forEach((p, i) => {
            console.log(`Phase ${i + 1}: ${p.phase} (${p.startDate.toISOString().split('T')[0]} to ${p.endDate.toISOString().split('T')[0]})`);
        });

        await prisma.subscription.update({ where: { id: subVip12.id }, data: { status: 'ENDED' } });


        // 3. Verify VIPPP16
        console.log('\n--- Verifying VIPPP16 ---');
        process.env.phase_finale_vippp = 'DETOX';
        const subVippp16 = await subscriptionsService.createSubscriptionForUser({
            userId: user.id,
            type: SubscriptionType.VIPPP16 as any,
            startDate: new Date().toISOString(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString(),
        });

        const subVippp16WithPhases = await subscriptionsService.findActiveSubscriptionForUser(user.id);
        if (!subVippp16WithPhases) throw new Error('VIPPP16 subscription not found');

        console.log(`VIPPP16 generated ${subVippp16WithPhases.phaseSessions.length} phases.`);
        subVippp16WithPhases.phaseSessions.forEach((p, i) => {
            console.log(`Phase ${i + 1}: ${p.phase} (${p.startDate.toISOString().split('T')[0]} to ${p.endDate.toISOString().split('T')[0]})`);
        });

    } catch (error) {
        console.error('Verification failed:', error);
    } finally {
        // Cleanup user
        // 1. Get all subscription IDs for this user
        const subs = await prisma.subscription.findMany({ where: { userId: user.id }, select: { id: true } });
        const subIds = subs.map(s => s.id);

        // 2. Delete all phase sessions for these subscriptions
        if (subIds.length > 0) {
            await prisma.phaseSession.deleteMany({ where: { subscriptionId: { in: subIds } } });
        }

        // 3. Delete subscriptions
        await prisma.subscription.deleteMany({ where: { userId: user.id } });

        // 4. Delete user
        await prisma.user.delete({ where: { id: user.id } });
        await app.close();
    }
}

bootstrap();
