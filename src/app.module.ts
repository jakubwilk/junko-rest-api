import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MailerModule } from './mailer/mailer.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        UsersModule,
        MailerModule,
        JwtModule.register({ secret: process.env['JWT_SECRET'] }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
