import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { RecipesModule } from './recipes/recipes.module';
import { MenusModule } from './menus/menus.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { WeighInsModule } from './weigh-ins/weigh-ins.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    SubscriptionsModule,
    RecipesModule,
    MenusModule,
    MenusModule,
    ShoppingListModule,
    WeighInsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
