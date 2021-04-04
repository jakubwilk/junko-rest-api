import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AddUserDto, CreateUserDto, LoginUserDto } from '../dto/auth.dto';
import { IUserLogin } from '../interfaces/users.interface';
import { CreateUserData } from '../types/user.types';
import { ROLES } from '../enum/roles';

@Controller('auth')
export class AuthController {
    constructor(private readonly _authService: AuthService) {}

    @Get('/:token')
    @HttpCode(HttpStatus.OK)
    async finishAddUser(@Param('token') token: string) {
        await this._authService.isValidToken(token);

        return { statusCode: HttpStatus.OK };
    }

    @Post('/add')
    @HttpCode(HttpStatus.OK)
    async addUser(@Body() userData: AddUserDto) {
        await this._authService.add(userData);

        return { statusCode: HttpStatus.OK };
    }

    @Post('/')
    @HttpCode(HttpStatus.OK)
    async loginUser(@Body() userData: LoginUserDto, @Res() res) {
        const { email, password, isRemember } = userData;

        const userLoginAction: IUserLogin = await this._authService.login(
            email,
            password,
            isRemember,
        );

        return res
            .header('Authorization', `Bearer ${userLoginAction.token}`)
            .json({ statusCode: HttpStatus.OK, userId: userLoginAction.id });
    }

    @Put('/add/:token')
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

        await this._authService.create(data);

        return { statusCode: HttpStatus.CREATED };
    }
}
