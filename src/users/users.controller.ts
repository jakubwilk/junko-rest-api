import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { ROLES } from '../constants/roles';
import { Roles } from '../auth/auth.decorator';
import { EditUserDto, UserDto, UsersDto } from '../dto/users.dto';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
    constructor(
        private readonly _userService: UsersService,
        private readonly _authService: AuthService,
    ) {}

    @Get('/all')
    @Roles(ROLES.EMPLOYEE, ROLES.OWNER)
    @HttpCode(HttpStatus.OK)
    async getUsersList() {
        const users: UsersDto[] = await this._userService.users();

        return { statusCode: HttpStatus.OK, data: users };
    }

    @Get('/edit/:userId')
    @Roles(ROLES.CLIENT, ROLES.EMPLOYEE, ROLES.OWNER)
    @HttpCode(HttpStatus.OK)
    async editUser(@Param('userId') userId: string) {
        const user: EditUserDto = await this._userService.getEdit(userId);

        return { statusCode: HttpStatus.OK, data: user };
    }

    @Post('/edit/:userId')
    @Roles(ROLES.CLIENT, ROLES.EMPLOYEE, ROLES.OWNER)
    @HttpCode(HttpStatus.OK)
    async saveEditUser(@Param('userId') userId: string, @Body() data: any) {
        // const user: EditUserDto = await this._userService.getEdit(userId);
        console.log(userId, data);

        return { statusCode: HttpStatus.OK };
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
