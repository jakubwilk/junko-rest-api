import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { OrdersService } from './orders.service';
import { ROLES } from '../constants/roles';
import { Roles } from '../auth/auth.decorator';
import {
    TAddNewOrder,
    TAddOrderHistoryData,
    TEditOrderData,
    TOrderHistoryData,
} from '../types/order.types';
import { OrderEmployeesDto, OrderOrdersListDto } from '../dto/orders.dto';

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

    @Get('/:orderId')
    @Roles(ROLES.EMPLOYEE, ROLES.OWNER)
    @HttpCode(HttpStatus.OK)
    async editOrder(@Param('orderId') orderId: string) {
        const editOrderObj = await this._orderService.editOrder(orderId);
        const { order, users } = editOrderObj;

        return { statusCode: HttpStatus.OK, order: order, users: users };
    }

    @Get('/user/:userId')
    @Roles(ROLES.CLIENT)
    @HttpCode(HttpStatus.OK)
    async getOrdersListForUser(@Param('userId') userId: string) {
        const data: OrderOrdersListDto[] = await this._orderService.getOrdersListForCurrentUser(
            userId,
        );

        return { statusCode: HttpStatus.OK, data: data };
    }

    @Get('/author/:userId')
    @Roles(ROLES.EMPLOYEE, ROLES.OWNER)
    @HttpCode(HttpStatus.OK)
    async getOrdersListForAuthor(@Param('userId') userId: string) {
        const data: OrderOrdersListDto[] = await this._orderService.getOrdersListForCurrentAuthor(
            userId,
        );

        return { statusCode: HttpStatus.OK, data: data };
    }

    @Put('/')
    @Roles(ROLES.EMPLOYEE, ROLES.OWNER)
    @HttpCode(HttpStatus.CREATED)
    async addOrder(@Body() body: TAddNewOrder) {
        await this._orderService.addNewOrder(body);

        return { statusCode: HttpStatus.CREATED };
    }

    @Post('/')
    @Roles(ROLES.EMPLOYEE, ROLES.OWNER)
    @HttpCode(HttpStatus.OK)
    async saveEditOrder(@Body() body: TEditOrderData) {
        await this._orderService.saveEditOrder(body);

        return { statusCode: HttpStatus.OK };
    }

    @Get('/history/:orderId')
    @Roles(ROLES.EMPLOYEE, ROLES.OWNER, ROLES.CLIENT)
    @HttpCode(HttpStatus.OK)
    async getCurrentOrderHistory(@Param('orderId') orderId: string) {
        const history: TOrderHistoryData[] = await this._orderService.getOrderHistory(
            orderId,
        );

        return { statusCode: HttpStatus.OK, data: history };
    }

    @Post('/history')
    @Roles(ROLES.EMPLOYEE, ROLES.OWNER)
    @HttpCode(HttpStatus.CREATED)
    async addHistoryOrder(@Body() body: TAddOrderHistoryData) {
        await this._orderService.addOrderHistory(body);

        return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR };
    }
}
