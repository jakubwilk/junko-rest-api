import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MailerModule } from './mailer/mailer.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';

@Module({
    imports: [UsersModule, MailerModule, AuthModule, OrdersModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
