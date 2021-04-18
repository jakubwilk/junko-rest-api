import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly authService: AuthService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<string[]>(
            'roles',
            context.getHandler(),
        );
        if (!roles) return true;

        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization;

        if (!token) throw new HttpException('', HttpStatus.UNAUTHORIZED);

        const isValidToken = await this.authService.isValidToken(
            token.replace('Bearer ', ''),
        );
        if (!isValidToken) throw new HttpException('', HttpStatus.UNAUTHORIZED);

        const userRole = await this.authService.extractValueFromPayload(
            token,
            'role',
        );
        const userRoles: string[] = [userRole];
        const matchRoles = () => userRoles.some((role) => roles.includes(role));

        return matchRoles();
    }
}
