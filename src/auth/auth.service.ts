import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserInitializeToken, UserSessionToken } from '../types/auth.types';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

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
}
