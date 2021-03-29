import {
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';

@Controller('users')
export class UsersController {
    constructor(
        private readonly _userService: UsersService,
        private readonly _authService: AuthService,
    ) {}

    @Get('/all')
    async getUsersList() {
        return this._userService.users();
    }

    @Get('/')
    @HttpCode(HttpStatus.OK)
    async userSession(@Req() req: Request) {
        console.log(req);

        return { statusCode: HttpStatus.OK };
    }

    @Delete('/:userId')
    @HttpCode(HttpStatus.OK)
    async deleteUser(@Param('userId') userId: string) {
        await this._userService.delete(userId);

        return { statusCode: HttpStatus.OK };
    }
}
