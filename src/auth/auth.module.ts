import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service';
import { MailerService } from '../mailer/mailer.service';

@Module({
    imports: [JwtModule.register({ secret: process.env['JWT_SECRET'] })],
    providers: [AuthService, PrismaService, MailerService],
    exports: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
