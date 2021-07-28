import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { ROLES } from '../constants/roles';

@Injectable()
export class OrdersService {
    constructor(private _prisma: PrismaService) {}

    async getEmplyeesList(): Promise<OrderEmployeesDto[]> {
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
}
