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
import { AddUserDto, LoginUserDto, RegisterUserDto } from '../dto/auth.dto';
import { IUserLogin } from '../interfaces/users.interface';

@UseGuards(AuthGuard)
@Controller('auth')
export class AuthController {
    constructor(private readonly _authService: AuthService) {}

    @Get('/activate/:token')
    @HttpCode(HttpStatus.ACCEPTED)
    async active(@Param('token') token: string) {
        await this._authService.activate(token);

        return { statusCode: HttpStatus.ACCEPTED };
    }

    @Get('/user/:userId')
    @Roles(ROLES.CLIENT, ROLES.EMPLOYEE, ROLES.OWNER)
    @HttpCode(HttpStatus.OK)
    async logout(@Param('userId') userId: string, @Req() req, @Res() res) {
        const token: string = req.cookies['auth_token'];
        const id: string = await this._authService.extractValueFromPayload(
            token,
            'id',
        );
        await this._authService.validateUserId(userId, id);

        return res
            .clearCookie('auth_token')
            .json({ statusCode: HttpStatus.OK });
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

    @Put('/')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() userData: RegisterUserDto) {
        await this._authService.create(userData);

        return { statusCode: HttpStatus.CREATED };
    }

    @Put('/add/user')
    @HttpCode(HttpStatus.CREATED)
    async addUser(@Body() userData: AddUserDto) {
        await this._authService.add(userData);

        return { statusCode: HttpStatus.CREATED };
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
}
