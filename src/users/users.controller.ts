import {
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
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

    @Get('/:uid')
    @HttpCode(HttpStatus.ACCEPTED)
    async userSession(@Param('uid') uid: string) {
        console.log(uid);

        return { statusCode: HttpStatus.ACCEPTED };
    }

    @Delete('/:userId')
    @HttpCode(HttpStatus.OK)
    async deleteUser(@Param('userId') userId: string) {
        await this._userService.delete(userId);

        return { statusCode: HttpStatus.OK };
    }
}
