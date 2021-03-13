import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service';
import { MailerService } from '../mailer/mailer.service';

@Module({
    providers: [UsersService, PrismaService, MailerService],
    controllers: [UsersController],
})
export class UsersModule {}
