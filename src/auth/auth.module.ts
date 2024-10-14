import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { GoogleStrategy } from "./google.strategy";
import { PassportModule } from "@nestjs/passport";
import { FacebookStrategy } from "./facebook.strategy";
import { AuthService } from "./auth.service";
import { MailerService } from "src/mailer/mailer.service";
import { MailerTemplateService } from "src/mailer/mailer.template.service";

@Module({
    imports: [PassportModule.register({ defaultStrategy: 'google' })],
    controllers: [AuthController],
    providers: [AuthService, GoogleStrategy, FacebookStrategy, MailerService, MailerTemplateService],
})
export class AuthModule { }