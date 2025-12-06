
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuWeekDto } from './dto/create-menu-week.dto';
import { UpdateMenuWeekDto } from './dto/update-menu-week.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role, PhaseType } from '@prisma/client';

@Controller()
export class MenusController {
    constructor(private readonly menusService: MenusService) { }

    // --- ADMIN ---

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post('admin/menus/week')
    create(@Body() createMenuWeekDto: CreateMenuWeekDto) {
        return this.menusService.create(createMenuWeekDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get('admin/menus/week/:phase/:semaineNumero')
    findOneByPhaseWeek(
        @Param('phase') phase: PhaseType,
        @Param('semaineNumero', ParseIntPipe) semaineNumero: number
    ) {
        return this.menusService.findOneByPhaseAndWeek(phase, semaineNumero);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Put('admin/menus/week/:id')
    update(@Param('id') id: string, @Body() updateMenuWeekDto: UpdateMenuWeekDto) {
        return this.menusService.update(id, updateMenuWeekDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('admin/menus/week/:id')
    remove(@Param('id') id: string) {
        return this.menusService.remove(id);
    }


    // --- USER ---
    @UseGuards(JwtAuthGuard)
    @Get('menus/current')
    getCurrentMenu(@Request() req) {
        return this.menusService.getCurrentMenuForUser(req.user.id);
    }
}
