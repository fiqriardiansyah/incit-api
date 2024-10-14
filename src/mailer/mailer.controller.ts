import { Body, Controller, Post } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import { MailerService } from './mailer.service';

@Controller('mailer')
export class MailerController {
    constructor(private readonly mailerService: MailerService) { }

    // @Post("/verification")
    // async sendInvitationCollab(@Body() body: Mail.Options) {
    //     const result = await this.mailerService.sendVerification(body);
    //     return {
    //         data: result,
    //     }
    // }
}
