import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { MailerService } from '../mailer/mailer.service';
import * as argon2 from 'argon2';
import { AddUserDto, LoginUserDto } from '../dto/users.dto';
import { AuthService } from '../auth/auth.service';
import { UserInitializeToken, UserSessionToken } from '../types/auth.types';
import { CreateUserData } from '../types/user.types';
import { IUserLogin } from '../interfaces/users.interface';

@Injectable()
export class UsersService {
    constructor(
        private _authService: AuthService,
        private _mailerService: MailerService,
        private _prisma: PrismaService,
    ) {}

    async users(): Promise<User[] | null> {
        return this._prisma.user.findMany();
    }

    async add(userData: AddUserDto) {
        const { email, role } = userData;
        const data: UserInitializeToken = {
            email: email,
            role: role,
            expireIn: '1h',
        };
        const token: string = await this._authService.createActivateToken(data);

        return this._mailerService.sendEmail(email, token);
    }

    async create(userData: CreateUserData): Promise<boolean> {
        const { email, role, password } = userData;

        const isEmailUsed: User | null = await this._prisma.user.findUnique({
            where: { email: email },
        });

        if (isEmailUsed !== null) {
            throw new HttpException(
                'Podany adres emailowy użytkownika jest już używany',
                HttpStatus.BAD_REQUEST,
            );
        }

        const passwordHash = await argon2.hash(password);

        await this._prisma.user.create({
            data: {
                email: email,
                password: passwordHash,
                role: role,
            },
        });

        return true;
    }

    async login(email: string): Promise<IUserLogin> {
        const user: User = await this._prisma.user.findUnique({
            where: { email: email },
        });

        const payload: UserSessionToken = {
            id: user.id,
            role: user.role,
            expireIn: '7d',
        };
        const token: string = await this._authService.createSessionToken(
            payload,
        );

        return { token: token, id: user.id };
    }

    // async edit() {}
    //
    // async logout() {}
}
