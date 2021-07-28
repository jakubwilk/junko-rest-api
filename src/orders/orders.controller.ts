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

@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
    constructor(private readonly _orderService: OrdersService) {}

    @Get('/')
    @Roles(ROLES.EMPLOYEE, ROLES.OWNER)
    @HttpCode(HttpStatus.OK)
    async getEmployeesList() {
        const users: OrderEmployeesDto[] = await this._orderService.getEmplyeesList();

        return { statusCode: HttpStatus.OK, data: users };
    }

    @Put('/')
    @Roles(ROLES.OWNER, ROLES.EMPLOYEE)
    @HttpCode(HttpStatus.CREATED)
    async addOrder(@Body() body) {
        console.log(body);

        return { statusCode: HttpStatus.CREATED };
    }
}
