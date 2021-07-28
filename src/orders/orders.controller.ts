import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Put,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { OrdersService } from './orders.service';
import { ROLES } from '../constants/roles';
import { Roles } from '../auth/auth.decorator';
import { TAddNewOrder } from '../types/order.types';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
    constructor(private readonly _orderService: OrdersService) {}

    @Get('/')
    @Roles(ROLES.EMPLOYEE, ROLES.OWNER)
    @HttpCode(HttpStatus.OK)
    async getEmployeesList() {
        const users: OrderEmployeesDto[] = await this._orderService.getEmployeesList();

        return { statusCode: HttpStatus.OK, data: users };
    }

    @Get('/all')
    @Roles(ROLES.EMPLOYEE, ROLES.OWNER)
    @HttpCode(HttpStatus.OK)
    async getOrdersList() {
        const orders: OrderOrdersListDto[] = await this._orderService.getOrdersList();

        return { statusCode: HttpStatus.OK, data: orders };
    }

    @Put('/')
    @Roles(ROLES.EMPLOYEE, ROLES.OWNER)
    @HttpCode(HttpStatus.CREATED)
    async addOrder(@Body() body: TAddNewOrder) {
        await this._orderService.addNewOrder(body);

        return { statusCode: HttpStatus.CREATED };
    }
}
