import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MailerModule } from './mailer/mailer.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [UsersModule, MailerModule, AuthModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
