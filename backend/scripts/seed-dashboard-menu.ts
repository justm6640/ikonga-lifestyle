
import { PrismaClient, PhaseType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'test.profile.v1@example.com';
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.error('User not found');
        return;
    }

    console.log(`User found: ${user.id}`);

    // Ensure active subscription
    const sub = await prisma.subscription.findFirst({
        where: { userId: user.id, status: 'ACTIVE' },
        include: { phaseSessions: true }
    });

    if (!sub) {
        console.log('Creating subscription...');
        // Create simple sub
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 30);

        const newSub = await prisma.subscription.create({
            data: {
                userId: user.id,
                type: 'STANDARD6',
                startDate,
                endDate,
                status: 'ACTIVE',
                phaseSessions: {
                    create: {
                        phase: 'DETOX',
                        startDate,
                        endDate
                    }
                }
            }
        });
        console.log('Subscription created');
    } else {
        console.log('Active subscription found');
    }

    // Create recipes if needed
    let recipe = await prisma.recipe.findFirst({ where: { title: 'Test Breakfast' } });
    if (!recipe) {
        recipe = await prisma.recipe.create({
            data: {
                title: 'Test Breakfast',
                description: 'Yummy',
                ingredients: {},
                steps: {},
                phaseTag: 'DETOX',
                calories: 300
            }
        });
    }

    // Create MenuDay for DETOX Day 1 (assuming dayInPhase 1)
    // We need to know what day it really is for the user?
    // Let's just create for Week 1 Day 1 which corresponds to dayInPhase 1

    await prisma.menuDay.create({
        data: {
            phase: 'DETOX',
            semaineNumero: 1,
            jourNumero: 1,
            petitDejeunerId: recipe.id,
            dejeunerId: recipe.id,
            dinerId: recipe.id
        }
    });

    console.log('MenuDay created for DETOX Week 1 Day 1');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
