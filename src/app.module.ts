import { Module } from '@nestjs/common';
import { SModule } from './co/s/s.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';

@Module({
    imports: [SModule, UsersModule, OrdersModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
