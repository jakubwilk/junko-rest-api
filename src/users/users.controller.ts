import {
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Req,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { ROLES } from '../constants/roles';
import { Roles } from '../auth/auth.decorator';
import { UserDto } from '../dto/users.dto';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
    constructor(
        private readonly _userService: UsersService,
        private readonly _authService: AuthService,
    ) {}

    @Get('/all')
    @Roles(ROLES.CLIENT)
    async getUsersList() {
        return this._userService.users();
    }

    @Get('/:userId')
    @Roles(ROLES.CLIENT, ROLES.EMPLOYEE, ROLES.OWNER)
    @HttpCode(HttpStatus.OK)
    async userSession(@Param('userId') userId: string) {
        const user: UserDto = await this._userService.user(userId);

        return { statusCode: HttpStatus.OK, data: user };
    }

    @Delete('/:userId')
    @HttpCode(HttpStatus.OK)
    async deleteUser(@Param('userId') userId: string) {
        await this._userService.delete(userId);

        return { statusCode: HttpStatus.OK };
    }
}
