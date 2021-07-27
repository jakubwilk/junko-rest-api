import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    providers: [OrdersService, PrismaService],
    controllers: [OrdersController],
})
export class OrdersModule {}
