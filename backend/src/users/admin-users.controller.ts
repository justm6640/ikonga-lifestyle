
import { Controller, Get, Param, Patch, Body, Query, UseGuards, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Role } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminUsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    async findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? parseInt(limit, 10) : 10;
        const skip = (pageNumber - 1) * limitNumber;

        const users = await this.usersService.findAll({
            skip,
            take: limitNumber,
            orderBy: { createdAt: 'desc' },
        });

        // Optional: Count total for pagination metadata
        // For now, just return list
        return {
            data: users,
            page: pageNumber,
            limit: limitNumber,
        };
    }

    @Get(':id/overview')
    async getOverview(@Param('id') id: string) {
        return this.usersService.getUserOverview(id);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const user = await this.usersService.findByIdWithDetails(id);
        if (!user) {
            throw new NotFoundException('Utilisateur non trouvé');
        }
        return user;
    }

    @Patch(':id/role')
    async updateRole(
        @Param('id') id: string,
        @Body() body: { role: Role }
    ) {
        // Simple validation could be added via DTO
        if (!Object.values(Role).includes(body.role)) {
            throw new NotFoundException('Rôle invalide');
        }

        return this.usersService.updateRole(id, body.role);
    }
}
