import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
    constructor(
        private _authService: AuthService,
        private _prisma: PrismaService,
    ) {}

    async users(): Promise<User[] | null> {
        return this._prisma.user.findMany();
    }

    async delete(userId: string): Promise<void> {
        try {
            await this._prisma.user.update({
                where: { id: userId },
                data: {
                    is_active: false,
                },
            });
        } catch (err: unknown) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // async edit() {}
    //
    // async logout() {}
}
