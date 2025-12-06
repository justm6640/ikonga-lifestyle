
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ShoppingListService } from './shopping-list.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import type { User } from '@prisma/client';

@Controller('shopping-list')
@UseGuards(JwtAuthGuard)
export class ShoppingListController {
    constructor(private shoppingListService: ShoppingListService) { }

    @Get('week')
    async getWeeklyShoppingList(@GetUser() user: User) {
        return this.shoppingListService.getWeeklyShoppingList(user.id);
    }
}
