
import { Controller, Post, Body, Get, Param, UseGuards, Query, Patch, Delete } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { AssignSubscriptionDto } from './dto/assign-subscription.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role, SubscriptionStatus } from '@prisma/client';

@Controller('admin/subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class SubscriptionsController {
    constructor(private readonly subscriptionsService: SubscriptionsService) { }

    @Post()
    create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
        return this.subscriptionsService.createSubscriptionForUser(createSubscriptionDto);
    }

    @Post('assign')
    assignSubscription(@Body() assignSubscriptionDto: AssignSubscriptionDto) {
        return this.subscriptionsService.assignSubscriptionToUser(assignSubscriptionDto);
    }

    @Get('users/:userId')
    findAllForUser(@Param('userId') userId: string) {
        return this.subscriptionsService.listSubscriptionsForUser(userId);
    }

    @Get()
    findAll(
        @Query('userId') userId?: string,
        @Query('status') status?: SubscriptionStatus,
    ) {
        return this.subscriptionsService.findAll({ userId, status });
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id') id: string,
        @Body() body: { status: SubscriptionStatus }
    ) {
        return this.subscriptionsService.updateStatus(id, body.status);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.subscriptionsService.deleteSubscription(id);
    }
}
