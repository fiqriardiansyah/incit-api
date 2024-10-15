import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerTemplateService } from './mailer.template.service';

@Module({
    controllers: [],
    providers: [MailerService, MailerTemplateService],
})
export class MailerModule { }
