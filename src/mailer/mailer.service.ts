import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';

type EmailData = {
    to: string;
    from: string;
    subject: string;
    text: string;
    html: string;
};

@Injectable()
export class MailerService {
    constructor(@InjectSendGrid() private readonly _client: SendGridService) {}

    async sendEmail(email: string, token: string): Promise<boolean> {
        const msg: EmailData = {
            to: email,
            from: 'jw@jakubwilk.pl',
            subject: 'Autorization Code',
            text: 'Your authorization code to finish register',
            html: `
                <p>Witaj, by dokończyć proces rejestracji proszę ustawić hasło na konta: <br />
                    <strong>${email}</strong>
                </p>
                <a href="http://localhost:3000/users/${token}" target="_blank">custom_url_with_token</a>
            `,
        };

        const message = await this._client.send(msg);

        if (!message) {
            throw new HttpException(
                'Wystąpił błąd podczas wysyłania wiadomości. Proszę skontaktować się z administratorem po więcej informacji.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return true;
    }
}
