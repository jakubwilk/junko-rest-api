import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { MailerService } from '../mailer/mailer.service';
import * as argon2 from 'argon2';
import { AddUserDto } from '../dto/users.dto';
import { AuthService } from '../auth/auth.service';
import { UserInitializeToken } from '../types/auth.types';

type CreateUserData = {
    email: string;
    password: string;
};

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
        const { email } = userData;

        const data: UserInitializeToken = {
            email: email,
            expireIn: '1h',
        };
        const token: string = await this._authService.createToken(data);
        return this._mailerService.sendEmail(email, token);
    }

    // async create(userData: CreateUserData) {
    //     try {
    //         const { email, password } = userData;
    //
    //         // Need check if address email is already in use
    //
    //         const passwordHash = await argon2.hash(password);
    //     } catch (error: unknown) {
    //         // Do something with error
    //     }
    // }
    //
    // async active() {}
    //
    // async login() {}
    //
    // async edit() {}
    //
    // async logout() {}
}
