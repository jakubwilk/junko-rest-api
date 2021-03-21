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
import { AddUserDto, CreateUserDto } from '../dto/users.dto';
import { AuthService } from '../auth/auth.service';
import { CreateUserData } from '../types/user.types';
import { ROLES } from '../enum/roles';

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

    @Post('/add/:token')
    @HttpCode(HttpStatus.CREATED)
    async createUser(
        @Param('token') token: string,
        @Body() userData: CreateUserDto,
    ) {
        const { password } = userData;
        const email: string = await this._authService.extractValueFromPayload(
            token,
            'email',
        );
        const role: string = await this._authService.extractValueFromPayload(
            token,
            'role',
        );
        const data: CreateUserData = {
            email: email,
            password: password,
            role: ROLES[role],
        };
        data.role = Number(ROLES[data.role]);

        await this._userService.create(data);

        return { statusCode: HttpStatus.CREATED };
    }

    @Post('/add')
    @HttpCode(HttpStatus.OK)
    async addUser(@Body() userData: AddUserDto) {
        await this._userService.add(userData);

        return { statusCode: HttpStatus.OK };
    }
}
