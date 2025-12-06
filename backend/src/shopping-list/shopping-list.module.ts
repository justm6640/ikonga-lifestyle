
import { Module } from '@nestjs/common';
import { ShoppingListService } from './shopping-list.service';
import { ShoppingListController } from './shopping-list.controller';
import { MenusModule } from '../menus/menus.module';

@Module({
    imports: [MenusModule],
    controllers: [ShoppingListController],
    providers: [ShoppingListService],
})
export class ShoppingListModule { }
