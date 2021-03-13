import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
    imports: [UsersModule, MailerModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
