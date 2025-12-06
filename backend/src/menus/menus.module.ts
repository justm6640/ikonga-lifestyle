
import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { PrismaService } from '../prisma.service';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
    imports: [SubscriptionsModule],
    controllers: [MenusController],
    providers: [MenusService, PrismaService],
    exports: [MenusService],
})
export class MenusModule { }
