import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { AddUserDto } from '../dto/users.dto';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly _userService: UsersService,
        private readonly _authService: AuthService,
    ) {}

    @Get('/')
    async getUsersList() {
        return this._userService.users();
    }

    @Get('/:token')
    @HttpCode(HttpStatus.OK)
    async finishAddUser(@Param('token') token: string) {
        await this._authService.isValidToken(token);

        return { statusCode: HttpStatus.OK };
    }

    @Post('/add')
    @HttpCode(HttpStatus.OK)
    async addUser(@Body() userData: AddUserDto) {
        await this._userService.add(userData);

        return { statusCode: HttpStatus.OK };
    }
}
