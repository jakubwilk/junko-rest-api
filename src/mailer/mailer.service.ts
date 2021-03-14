import { Injectable } from '@nestjs/common';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';

@Injectable()
export class MailerService {
    constructor(@InjectSendGrid() private readonly _client: SendGridService) {}

    async sendEmail(email: string) {
        const msg = {
            to: email,
            from: 'jw@jakubwilk.pl',
            subject: 'Autorization Code',
            text: 'Your authorization code to finish register',
            template_id: 'd-4280aa7bae444c1abb71d548b9cb02d1',
            dynamic_template_data: {
                message: 'Witaj użytkowniku',
                email: email,
                link: 'https://www.google.com',
            },
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
