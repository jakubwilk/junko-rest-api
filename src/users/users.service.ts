import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class UsersService {
    constructor(
        private mailerService: MailerService,
        private prisma: PrismaService,
    ) {}

    async users(): Promise<User[] | null> {
        return this.prisma.user.findMany();
    }
}
