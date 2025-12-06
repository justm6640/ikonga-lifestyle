import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardKpiDto } from './dto/dashboard-kpi.dto';

@Controller('me')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @UseGuards(JwtAuthGuard)
    @Get('dashboard')
    async getDashboard(@Request() req): Promise<DashboardKpiDto> {
        const userId = req.user.id;
        return this.dashboardService.getDashboardForUser(userId);
    }
}
