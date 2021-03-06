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
            subject: 'Dokończenie rejestracji',
            text: 'Twój link autoryzacyjny do ukończenia rejestracji',
            html: `
                <p>Witaj, by dokończyć proces rejestracji prosze kliknąć w poniższy link: <br />
                    <strong>${email}</strong>
                </p>
                <a href="http://localhost:3000/auth/active/${token}" target="_blank">Aktywuj konto</a>
            `,
        };

        const message = await this._client.send(msg);

        if (!message) {
            throw new HttpException(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return true;
    }
}
