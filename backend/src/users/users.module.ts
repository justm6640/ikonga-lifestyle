import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AdminUsersController } from './admin-users.controller';
import { PrismaService } from '../prisma.service';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { WeighInsModule } from '../weigh-ins/weigh-ins.module';

@Module({
  imports: [SubscriptionsModule, WeighInsModule],
  controllers: [UsersController, AdminUsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule { }
