import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service';
import { MailerService } from '../mailer/mailer.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    providers: [UsersService, PrismaService, MailerService],
    controllers: [UsersController],
})
export class UsersModule {}
