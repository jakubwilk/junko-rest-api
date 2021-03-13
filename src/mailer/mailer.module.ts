import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';

@Module({
    imports: [
        SendGridModule.forRoot({
            apiKey: process.env['SENDGRID_API_KEY'],
        }),
    ],
    controllers: [],
    providers: [MailerService],
})
export class MailerModule {}
