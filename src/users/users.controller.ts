import { Body, Controller, Get, Post } from '@nestjs/common';
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
    async addUser(@Body() userData: AddUserDto) {
        return this._userService.add(userData);
    }
}
