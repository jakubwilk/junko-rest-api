import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserInitializeToken, UserSessionToken } from '../types/auth.types';
import { AddUserDto } from '../dto/users.dto';
import { CreateUserData } from '../types/user.types';
import { User } from '@prisma/client';
import { IUserLogin } from '../interfaces/users.interface';
import { MailerService } from '../mailer/mailer.service';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private _mailerService: MailerService,
        private _prisma: PrismaService,
    ) {}

    async createActivateToken(data: UserInitializeToken): Promise<string> {
        const { email, role, expireIn } = data;

        return this.jwtService.sign(
            { email: email, role: role },
            { expiresIn: expireIn },
        );
    }

    async createSessionToken(data: UserSessionToken): Promise<string> {
        const { id, role, expireIn } = data;

        return this.jwtService.sign(
            { id: id, role: role },
            { expiresIn: expireIn },
        );
    }

    async isValidToken(token: string): Promise<boolean> {
        try {
            await this.jwtService.verify(token, {
                secret: process.env['JWT_SECRET'],
            });

            return true;
        } catch (err: unknown) {
            throw new HttpException(err, HttpStatus.UNAUTHORIZED);
        }
    }

    async extractValueFromPayload(
        token: string,
        value: string,
    ): Promise<string> {
        await this.isValidToken(token);

        const field = await this.jwtService.decode(token);

        return field[value];
    }

    async validUserPassword(
        hashPassword: string,
        userPassword: string,
    ): Promise<boolean> {
        try {
            await argon2.verify(hashPassword, userPassword);
            return true;
        } catch (err: unknown) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
    }

    async add(userData: AddUserDto) {
        const { email, role } = userData;
        const data: UserInitializeToken = {
            email: email,
            role: role,
            expireIn: '1h',
        };
        const token: string = await this.createActivateToken(data);

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

    async login(email: string, password: string): Promise<IUserLogin> {
        const user: User = await this._prisma.user.findUnique({
            where: { email: email },
        });

        await this.validUserPassword(user.password, password);

        const payload: UserSessionToken = {
            id: user.id,
            role: user.role,
            expireIn: '7d',
        };
        const token: string = await this.createSessionToken(payload);

        return { token: token, id: user.id };
    }
}
