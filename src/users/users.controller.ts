import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get('/auth')
    async verificationMail() {
        return this.userService.users();
    }
}
