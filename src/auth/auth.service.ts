import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserInitializeToken } from '../types/auth.types';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

    async createToken(data: UserInitializeToken): Promise<string> {
        const { email, expireIn } = data;

        return this.jwtService.sign({ email: email }, { expiresIn: expireIn });
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
}