import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { OrdersService } from './orders.service';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
    constructor(private readonly _orderService: OrdersService) {}
}
