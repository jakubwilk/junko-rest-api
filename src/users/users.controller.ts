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
import { ROLES } from '../enum/roles';
import { Roles } from '../auth/auth.decorator';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
    constructor(
        private readonly _userService: UsersService,
        private readonly _authService: AuthService,
    ) {}

    @Get('/all')
    @Roles(ROLES.USER)
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
