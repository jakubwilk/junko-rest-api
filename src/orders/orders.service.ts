import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Order, User, History } from '@prisma/client';
import { ROLES } from '../constants/roles';
import {
    TAddNewOrder,
    TAddOrderHistoryData,
    TAddOrderHistoryDataDb,
    TEditOrderData,
    TNewOrderData,
    TOrderHistoryData,
} from '../types/order.types';
import {
    OrderEditOrderDto,
    OrderEmployeesDto,
    OrderOrdersListDto,
} from '../dto/orders.dto';

@Injectable()
export class OrdersService {
    constructor(private _prisma: PrismaService) {}

    async getEmployeeName(id: string): Promise<string> {
        try {
            const user: User = await this._prisma.user.findUnique({
                where: {
                    id: id,
                },
            });

            return `${user.first_name} ${user.last_name}`;
        } catch (err: unknown) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getEmployeesList(): Promise<OrderEmployeesDto[]> {
        const usersList: User[] = await this._prisma.user.findMany({
            where: {
                OR: [
                    {
                        role: ROLES.EMPLOYEE,
                    },
                    {
                        role: ROLES.OWNER,
                    },
                ],
            },
        });
        const users: OrderEmployeesDto[] = [];

        usersList.map((user: User) => {
            const userItem: OrderEmployeesDto = {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
            };

            users.push(userItem);
        });

        return users;
    }

    async getOrdersListForCurrentUser(
        userId: string,
    ): Promise<OrderOrdersListDto[]> {
        try {
            const user: User | null = await this._prisma.user.findUnique({
                where: {
                    id: userId,
                },
            });

            if (user === null) {
                throw new HttpException(null, HttpStatus.BAD_REQUEST);
            }

            const orders: Order[] | null = await this._prisma.order.findMany({
                where: {
                    clientEmail: user.email,
                },
            });
            const ordersList: OrderOrdersListDto[] = [];

            for (const order of orders) {
                const data: OrderOrdersListDto = {
                    orderId: order.id,
                    client: order.clientEmail,
                    startDate: order.created_at,
                    modifyDate: order.updated_at,
                    employee: '',
                    status: order.status,
                };

                data.employee = await this.getEmployeeName(order.employeeId);

                ordersList.push(data);
            }

            return ordersList.length > 0 ? ordersList : [];
        } catch (err: unknown) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getOrdersListForCurrentAuthor(
        userId: string,
    ): Promise<OrderOrdersListDto[]> {
        try {
            const orders: Order[] | null = await this._prisma.order.findMany({
                where: {
                    employeeId: userId,
                },
            });
            const ordersList: OrderOrdersListDto[] = [];

            for (const order of orders) {
                const data: OrderOrdersListDto = {
                    orderId: order.id,
                    client: order.clientEmail,
                    startDate: order.created_at,
                    modifyDate: order.updated_at,
                    employee: '',
                    status: order.status,
                };

                data.employee = await this.getEmployeeName(order.employeeId);

                ordersList.push(data);
            }

            return ordersList.length > 0 ? ordersList : [];
        } catch (err: unknown) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getOrdersList(): Promise<OrderOrdersListDto[]> {
        try {
            const orders: Order[] | null = await this._prisma.order.findMany();
            const ordersList: OrderOrdersListDto[] = [];

            for (const order of orders) {
                const data: OrderOrdersListDto = {
                    orderId: order.id,
                    client: order.clientEmail,
                    startDate: order.created_at,
                    modifyDate: order.updated_at,
                    employee: '',
                    status: order.status,
                };

                data.employee = await this.getEmployeeName(order.employeeId);

                ordersList.push(data);
            }

            return ordersList.length > 0 ? ordersList : [];
        } catch (err: unknown) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async addNewOrder(data: TAddNewOrder): Promise<boolean> {
        try {
            const {
                employeeId,
                customerEmail,
                title,
                issueTime,
                details,
            } = data;
            const orderObj: TNewOrderData = {
                title: title,
                clientEmail: customerEmail,
                employeeId: employeeId,
                issueTime: issueTime,
                created_at: new Date(),
                updated_at: new Date(),
                status: 1,
                details: details,
            };

            await this._prisma.order.create({
                data: orderObj,
            });

            return true;
        } catch (err: unknown) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async editOrder(id: string): Promise<OrderEditOrderDto> {
        try {
            const currentOrder: Order | null = await this._prisma.order.findUnique(
                {
                    where: {
                        id: id,
                    },
                },
            );
            const users: User[] = await this._prisma.user.findMany({
                where: {
                    OR: [
                        {
                            role: ROLES.EMPLOYEE,
                        },
                        {
                            role: ROLES.OWNER,
                        },
                    ],
                },
            });
            const usersList: OrderEmployeesDto[] = [];

            users.map((user: User) => {
                const userItem: OrderEmployeesDto = {
                    id: user.id,
                    firstName: user.first_name,
                    lastName: user.last_name,
                };

                usersList.push(userItem);
            });

            if (currentOrder === null) {
                throw new HttpException(null, HttpStatus.NOT_FOUND);
            }

            return { order: currentOrder, users: usersList };
        } catch (err: unknown) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async saveEditOrder(data: TEditOrderData): Promise<boolean> {
        const created_at: Date = new Date(data.created_at);
        const updated_at: Date = new Date();
        const issueTime: Date = new Date(data.issueTime);

        if (typeof data.status === 'string') {
            data.status = parseInt(data.status);
        }

        data.created_at = created_at;
        data.updated_at = updated_at;
        data.issueTime = issueTime;

        await this._prisma.order.update({
            where: {
                id: data.id,
            },
            data: data,
        });

        try {
            return true;
        } catch (err: unknown) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getOrderHistory(orderId: string): Promise<TOrderHistoryData[]> {
        try {
            const history: TOrderHistoryData[] = await this._prisma.history.findMany(
                {
                    where: {
                        order_id: orderId,
                    },
                },
            );

            if (history === null) {
                return [];
            }

            return history;
        } catch (err: unknown) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async addOrderHistory(data: TAddOrderHistoryData): Promise<boolean> {
        try {
            const body: TAddOrderHistoryDataDb = {
                order_id: data.id,
                title: data.title,
                created_at: new Date(data.time),
                updated_at: new Date(),
                description: data.description,
            };

            await this._prisma.history.create({
                data: body,
            });

            await this._prisma.order.update({
                where: {
                    id: data.id,
                },
                data: {
                    status: 2,
                },
            });

            return true;
        } catch (err: unknown) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
