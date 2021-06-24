import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserInitializeToken, UserSessionToken } from '../types/auth.types';
import { AddUserDto } from '../dto/auth.dto';
import { CreateUserData } from '../types/user.types';
import { User } from '@prisma/client';
import { IUserLogin } from '../interfaces/users.interface';
import { MailerService } from '../mailer/mailer.service';
import { PrismaService } from '../prisma.service';
import { ROLES } from '../constants/roles';

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

    async validateUserId(
        userId: string,
        userIdFromToken: string,
    ): Promise<boolean> {
        if (userId !== userIdFromToken) {
            throw new HttpException(null, HttpStatus.UNAUTHORIZED);
        }

        return true;
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
        const isValid: boolean = await argon2.verify(
            hashPassword,
            userPassword,
        );

        if (!isValid) {
            throw new HttpException(null, HttpStatus.BAD_REQUEST);
        }

        return true;
    }

    async getUserRole(userId: string) {
        const user: User | null = await this._prisma.user.findUnique({
            where: { id: userId },
        });

        if (user === null) return 0;

        return user.role;
    }

    async create(userData: CreateUserData): Promise<boolean> {
        const { email, password } = userData;
        const isEmailUsed: User | null = await this._prisma.user.findUnique({
            where: { email: email },
        });

        if (isEmailUsed !== null) {
            throw new HttpException(null, HttpStatus.BAD_REQUEST);
        }

        const passwordHash = await argon2.hash(password);
        const data: UserInitializeToken = {
            email: email,
            role: ROLES.CLIENT,
            expireIn: '24h',
        };
        const token: string = await this.createActivateToken(data);
        await this._prisma.user.create({
            data: {
                email: email,
                password: passwordHash,
                role: ROLES.CLIENT,
                is_active: false,
            },
        });
        await this._mailerService.sendEmail(email, token);

        return true;
    }

    async login(
        email: string,
        password: string,
        isRemember: boolean,
    ): Promise<IUserLogin> {
        const user: User = await this._prisma.user.findUnique({
            where: { email: email },
        });

        if (user === null) {
            throw new HttpException(null, HttpStatus.FORBIDDEN);
        }

        if (!user.is_active) {
            throw new HttpException(null, HttpStatus.UNAUTHORIZED);
        }

        await this.validUserPassword(user.password, password);

        const payload: UserSessionToken = {
            id: user.id,
            role: user.role,
            expireIn: isRemember ? '7d' : '24h',
        };
        const token: string = await this.createSessionToken(payload);

        return { token: token, id: user.id };
    }

    async activate(token: string) {
        await this.isValidToken(token);
        const email: string = await this.extractValueFromPayload(
            token,
            'email',
        );
        const user: User | null = await this._prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (user.is_active === true) {
            throw new HttpException(null, HttpStatus.BAD_REQUEST);
        }

        await this._prisma.user.update({
            where: {
                email: email,
            },
            data: {
                is_active: true,
            },
        });

        return true;
    }
}
