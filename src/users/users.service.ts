import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
import { EditUserDto, UserDto, UsersDto, UsersStats } from '../dto/users.dto';
import { ROLES } from '../constants/roles';

@Injectable()
export class UsersService {
    constructor(
        private _authService: AuthService,
        private _prisma: PrismaService,
    ) {}

    async stats(): Promise<UsersStats> {
        try {
            const usersList: User[] = await this._prisma.user.findMany();
            const employeesList: User[] = await this._prisma.user.findMany({
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

            const usersAmount: number = usersList.length;
            const employeesAmount: number = employeesList.length;

            return { users: usersAmount, employees: employeesAmount };
        } catch (err: unknown) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async users(): Promise<UsersDto[] | null> {
        const usersList: User[] = await this._prisma.user.findMany();
        const users: UsersDto[] = [];

        usersList.map((user: User) => {
            const userItem: UsersDto = {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role,
                photo: user.photo,
                isActive: user.is_active,
                createdAt: user.created_at,
            };

            users.push(userItem);
        });

        return users;
    }

    async user(userId: string): Promise<UserDto | null> {
        try {
            const user: User = await this._prisma.user.findUnique({
                where: { id: userId },
            });

            return {
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
            };
        } catch (err: unknown) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
    }

    async toggleActivate(userId: string, isActivate: string): Promise<void> {
        try {
            const userStatus = isActivate === 'true';
            await this._prisma.user.update({
                where: { id: userId },
                data: {
                    is_active: userStatus,
                },
            });
        } catch (err: unknown) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async edit(userId: string, data: any): Promise<boolean> {
        try {
            await this._prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    city: data.city,
                    role: data.role,
                    phone_number: data.phoneNumber,
                },
            });

            if (data.password !== '') {
                await this._prisma.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        password: data.password,
                    },
                });
            }

            return true;
        } catch (err: unknown) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getEdit(userId: string): Promise<EditUserDto> {
        try {
            const user: User = await this._prisma.user.findUnique({
                where: { id: userId },
            });

            const userData: EditUserDto = {
                firstName: user.first_name,
                lastName: user.last_name,
                photo: user.photo,
                role: user.role,
                city: user.city,
                phoneNumber: user.phone_number,
            };

            return userData;
        } catch (err: unknown) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
