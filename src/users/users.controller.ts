import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
    constructor(private readonly _userService: UsersService) {}

    @Get('/')
    async getUsersList() {
        return this._userService.users();
    }
}
