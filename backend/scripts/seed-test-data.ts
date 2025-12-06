
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { SubscriptionsService } from '../src/subscriptions/subscriptions.service';
import { SubscriptionType } from '@prisma/client';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);
    const subscriptionsService = app.get(SubscriptionsService);

    const email = 'test@ikonga.com';
    const password = 'password123';
    const firstName = 'Test';
    const lastName = 'User';

    console.log(`Checking if user ${email} exists...`);
    let user = await usersService.findOne(email);

    if (!user) {
        console.log(`Creating user ${email}...`);
        user = await usersService.create({
            email,
            passwordHash: password,
            firstName,
            lastName,
        });
        console.log(`User created: ${user.id}`);
    } else {
        console.log(`User ${email} already exists.`);
    }

    // Reload user to be sure
    user = await usersService.findOne(email);
    if (!user) {
        console.error("User not found after creation/check.");
        await app.close();
        return;
    }

    console.log(`Checking active subscription for user ${user.id}...`);
    const activeSub = await subscriptionsService.findActiveSubscriptionForUser(user.id);

    if (activeSub) {
        console.log('User already has an active subscription.');
    } else {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 3); // Started 3 days ago
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 6);

        console.log(`Creating STANDARD6 subscription starting ${startDate.toISOString()}...`);

        await subscriptionsService.createSubscriptionForUser({
            userId: user.id,
            type: SubscriptionType.STANDARD6,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        });

        console.log('Subscription created successfully.');
    }

    await app.close();
}

bootstrap();
