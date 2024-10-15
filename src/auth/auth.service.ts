import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "src/common/prisma.service";
import { Auth, SignEmail } from "src/model/auth";
import * as bcrypt from 'bcrypt';
import { generateRandomId } from "src/utils";
import { RequestUser } from "src/common/auth.middleware";
import { MailerService } from "src/mailer/mailer.service";

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService, private mailerService: MailerService) { }

    async oAuthSign(args: { auth: Auth, provider: "google" | "facebook" }) {
        try {
            if (!args.auth.email) {
                throw new HttpException("Email not provided", HttpStatus.BAD_REQUEST);
            }

            const getUser = (await this.prismaService.$queryRaw(Prisma.raw(`
                SELECT * FROM public."user" u WHERE u."email" = '${args.auth.email}'
            `))[0] as User)

            let userId = getUser?.id;

            if (!getUser) {

                const create = await this.prismaService.user.create({
                    data: {
                        email: args.auth.email,
                        firstname: args.auth?.firstName,
                        lastname: args.auth?.lastName,
                        picture: args.auth.picture,
                        verified: true,
                    }
                });

                userId = create.id;
            } else {
                const updateCount = await this.prismaService.user.update({
                    where: { id: userId },
                    data: {
                        countlogin: getUser?.countlogin + 1,
                    }
                });
            }

            const createSession = await this.prismaService.oAuthToken.create({
                data: {
                    provider: args.provider,
                    accesstoken: args.auth.accessToken,
                    userid: userId,
                }
            });

            return createSession;

        } catch (e: any) {
            throw new HttpException(e?.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async signInEmail(data: SignEmail) {
        try {
            const user = (await this.prismaService.$queryRaw(Prisma.raw(`
                SELECT * FROM public.user u where u."email" = '${data.email}'
            `))[0] as User);

            if (!user) {
                throw new HttpException("Email or password is wrong", HttpStatus.NOT_FOUND);
            }

            if (!user?.password) {
                throw new HttpException("Password has not been set yet", HttpStatus.NOT_FOUND);
            }

            const matchPass = await bcrypt.compare(data.password, user?.password);

            if (!matchPass) {
                throw new HttpException("Email or password is wrong", HttpStatus.BAD_REQUEST);
            }

            await this.prismaService.user.update({
                where: { id: user?.id },
                data: {
                    countlogin: user?.countlogin + 1,
                }
            })

            const createSession = await this.prismaService.oAuthToken.create({
                data: {
                    provider: "email",
                    accesstoken: generateRandomId(),
                    userid: user?.id,
                }
            });

            return {
                email: user?.email,
                picture: user?.picture,
                firstname: user?.firstname,
                lastname: user?.lastname,
                accesstoken: createSession.accesstoken,
                verified: user?.verified,
            }

        } catch (e: any) {
            throw new HttpException(e?.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async signUpEmail(data: SignEmail) {
        try {
            const user = (await this.prismaService.$queryRaw(Prisma.raw(`
                SELECT * FROM public.user u where u."email" = '${data.email}'
            `))[0] as User);

            if (user) {
                throw new HttpException("Email already registered", HttpStatus.BAD_REQUEST);
            }

            const hashPassword = await bcrypt.hash(data.password, 10);

            const verificationToken = generateRandomId();

            const create = await this.prismaService.user.create({
                data: {
                    email: data.email,
                    firstname: "",
                    picture: "",
                    password: hashPassword,
                    verificationtoken: verificationToken,
                    countlogin: 1,
                }
            });

            const createSession = await this.prismaService.oAuthToken.create({
                data: {
                    provider: "email",
                    accesstoken: generateRandomId(),
                    userid: create.id,
                }
            });

            await this.mailerService.sendVerification({ email: data.email, token: verificationToken });

            return {
                email: create.email,
                picture: create.picture,
                firstname: create.firstname,
                lastname: create.lastname,
                accesstoken: createSession.accesstoken,
                verified: create.verified,
            }

        } catch (e: any) {
            throw new HttpException(e?.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async logout(user: RequestUser["user"]) {
        const removeSession = await this.prismaService.$executeRaw`DELETE FROM "oauthtoken" WHERE "accesstoken" = '${user.token}'`;
        const update = await this.prismaService.user.update({
            where: { id: user.id },
            data: {
                logoutat: new Date(),
            }
        });
        return true;
    }

    async verification(token: string) {
        const findToken = await this.prismaService.user.findFirst({
            where: {
                verificationtoken: token,
            }
        });

        if (!findToken) {
            throw new HttpException("Verification is invalid!", HttpStatus.BAD_REQUEST);
        };

        await this.prismaService.user.update({
            where: { id: findToken.id },
            data: {
                verified: true,
                verificationtoken: "",
            }
        });

        return "Account Verified"
    }

    async resendVerification(user: User) {
        const findUser = await this.prismaService.user.findFirst({
            where: { id: user.id }
        });

        const verificationToken = findUser?.verificationtoken || generateRandomId();
        await this.mailerService.sendVerification({ email: findUser.email, token: verificationToken });

        return "Email verification send"
    }
}