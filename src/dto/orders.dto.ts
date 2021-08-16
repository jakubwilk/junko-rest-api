import { TNewOrderData } from '../types/order.types';

export class OrderEmployeesDto {
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
}

export class OrderOrdersListDto {
    readonly orderId: string;
    readonly client: string;
    readonly startDate: Date;
    readonly modifyDate: Date;
    employee: string;
    readonly status: number;
}

export class OrderEditOrderDto {
    order: TNewOrderData;
    users: OrderEmployeesDto[];
}

export class OrdersStats {
    orders: number;
    activeOrders: number;
    userOrders: number;
}
