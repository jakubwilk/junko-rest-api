import { Body, Controller, Get, HttpCode, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { AddUserDto } from '../dto/users.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly _userService: UsersService) {}

    @Get('/')
    async getUsersList() {
        return this._userService.users();
    }

    @Post('/add')
    @HttpCode(200)
    async addUser(@Body() userData: AddUserDto) {
        const responseText: string = await this._userService.add(userData);

        return { statusCode: 200, message: responseText };
    }
}
