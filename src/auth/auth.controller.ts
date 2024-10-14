import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { Auth } from "src/common/auth.decorator";
import { RequestUser } from "src/common/auth.middleware";
import { SignEmail } from "src/model/auth";
import { AuthService } from "./auth.service";
import { User } from "@prisma/client";

@Controller("/auth")
export class AuthController {
    constructor(private authService: AuthService) { }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {
        console.log(req);
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res: Response) {
        const result = await this.authService.oAuthSign({ auth: req.user, provider: "google" });
        res.cookie('token', result.accesstoken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
            // domain: process.env.NODE_ENV === "development" ? "localhost" : process.env.FE_DOMAIN,
            path: "/",
        });

        return res.redirect(process.env.FE_URL + "/dashboard");
    }

    @Get('facebook')
    @UseGuards(AuthGuard('facebook'))
    async facebookAuth(@Req() req) {
        console.log(req);
    }

    @Get('facebook/callback')
    @UseGuards(AuthGuard('facebook'))
    async facebookAuthRedirect(@Req() req, @Res() res: Response) {
        try {
            const result = await this.authService.oAuthSign({ auth: req.user, provider: "facebook" });

            res.cookie('token', result.accesstoken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
                // domain: process.env.NODE_ENV === "development" ? "localhost" : process.env.FE_DOMAIN,
                path: "/",
            });

            return res.redirect(process.env.FE_URL + "/dashboard");
        } catch (e: any) {
            return res.redirect(process.env.FE_URL + `/signin?error=${e?.message}`);
        }
    }

    @Post("signin")
    async signinWithEmail(@Body() data: SignEmail) {
        const result = await this.authService.signInEmail(data);

        return {
            data: result,
        }
    }

    @Post("signup")
    async signupWithEmail(@Body() data: SignEmail) {
        const result = await this.authService.signUpEmail(data);

        return {
            data: result,
        }
    }

    @Get("logout")
    async logout(@Auth() user: RequestUser["user"], @Res() res: Response) {

        await this.authService.logout(user);

        return res.redirect(process.env.FE_URL + "/signin");
    }

    @Get("verification")
    async verification(@Query("token") token: string, @Res() res: Response) {

        await this.authService.verification(token);

        return res.redirect(process.env.FE_URL + "/dashboard");
    }

    @Get("resend-verification")
    async resendVerification(@Auth() user: User) {
        const result = await this.authService.resendVerification(user);
        return {
            data: result,
        }
    }
}