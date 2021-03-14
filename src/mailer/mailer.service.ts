import { Injectable } from '@nestjs/common';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';

@Injectable()
export class MailerService {
    constructor(@InjectSendGrid() private readonly _client: SendGridService) {}

    async sendEmail() {
        const msg = {
            to: 'jw@jakubwilk.pl',
            from: 'jw@jakubwilk.pl',
            subject: 'Autorization Code',
            text: 'Your authorization code to finish register',
            html: '<strong>Test HTML partial</strong>',
        };

        this._client
            .send(msg)
            .then(() => {
                console.log('Email sent');
            })
            .catch((error) => {
                console.log('Error');
                console.log(error);
            });
    }
}
