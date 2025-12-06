

import { Controller, Get, Request, UseGuards, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubscriptionType } from '@prisma/client';

import { UserProfileDto } from './dto/user-profile.dto';

// ... (imports)

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly subscriptionsService: SubscriptionsService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@Request() req): Promise<UserProfileDto> {
        // req.user contains { id, email, role } from JwtStrategy
        const user = await this.usersService.findById(req.user.id);
        if (!user) {
            throw new NotFoundException(`User not found`);
        }
        const { passwordHash, ...result } = user;
        return result as UserProfileDto;
    }

    @UseGuards(JwtAuthGuard)
    @Get('me/program-status')
    getProgramStatus(@Request() req) {
        return this.subscriptionsService.getCurrentProgramStatusForUser(req.user.id);
    }
}
