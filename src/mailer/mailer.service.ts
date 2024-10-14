import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { MailerTemplateService } from './mailer.template.service';

@Injectable()
export class MailerService {
    transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>

    constructor(private mailerTemplateService: MailerTemplateService) {
        this.transporter = this._mailTransport();
    }

    _mailTransport() {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        });
        return transporter
    }

    async sendVerification({ email, token }: { email: string, token: string }) {

        const html = await this.mailerTemplateService.compileTemplate("verification", {
            toName: email,
            verifyLink: process.env.API_URL + "/auth/verification?token=" + token,
            appLink: process.env.FE_URL,
        });

        const options: Mail.Options = {
            from: process.env.MAIL_USER,
            to: email,
            subject: "Verification Account",
            html,
        }

        try {
            const send = await this.transporter.sendMail(options);
            return send;
        } catch (e: any) {
            throw new HttpException(e?.message, HttpStatus.BAD_REQUEST)
        }
    }
}
