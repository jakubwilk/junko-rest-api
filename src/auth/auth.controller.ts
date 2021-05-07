import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Roles } from './auth.decorator';
import { ROLES } from '../constants/roles';
import { AddUserDto, CreateUserDto, LoginUserDto } from '../dto/auth.dto';
import { CreateUserData } from '../types/user.types';
import { IUserLogin } from '../interfaces/users.interface';

@UseGuards(AuthGuard)
@Controller('auth')
export class AuthController {
    constructor(private readonly _authService: AuthService) {}

    @Get('/')
    @Roles(ROLES.CLIENT, ROLES.EMPLOYEE, ROLES.OWNER)
    @HttpCode(HttpStatus.OK)
    async logout(@Res() res) {
        return { statusCode: HttpStatus.OK };
    }

    @Get('/role')
    @HttpCode(HttpStatus.OK)
    async check(@Req() req) {
        const token: string = req.cookies['auth_token'];
        const role: string = await this._authService.extractValueFromPayload(
            token,
            'role',
        );
        const id: string = await this._authService.extractValueFromPayload(
            token,
            'id',
        );

        return { statusCode: HttpStatus.OK, userRole: role, userId: id };
    }

    @Post('/')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() userData: LoginUserDto,
        @Res({ passthrough: true }) res,
    ) {
        const { email, password, isRemember } = userData;
        const userLoginAction: IUserLogin = await this._authService.login(
            email,
            password,
            isRemember,
        );
        const userRole: number = await this._authService.getUserRole(
            userLoginAction.id,
        );

        res.cookie('auth_token', userLoginAction.token, {
            maxAge: 86400000,
            secure: true,
            httpOnly: true,
        }).json({
            statusCode: HttpStatus.OK,
            userId: userLoginAction.id,
            userRole: userRole,
        });
    }

    @Post('/add')
    @Roles(ROLES.OWNER)
    @HttpCode(HttpStatus.OK)
    async add(@Body() userData: AddUserDto) {
        await this._authService.add(userData);

        return { statusCode: HttpStatus.OK };
    }

    @Put('/:token')
    @Roles(ROLES.CLIENT, ROLES.EMPLOYEE)
    @HttpCode(HttpStatus.CREATED)
    async register(
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

        await this._authService.create(data);

        return { statusCode: HttpStatus.CREATED };
    }
}
