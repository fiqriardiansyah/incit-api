import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/common/prisma.service";
import { PasswordChange, PasswordSet } from "src/model/user";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) { }

    async profile(user: User) {
        const getUser = await this.prismaService.user.findFirst({
            where: { id: user.id },
            select: { email: true, firstname: true, lastname: true, picture: true, verified: true }
        });

        return getUser;
    };

    async profileChange(user: User, data: Partial<User>) {
        const update = await this.prismaService.user.update({
            where: { id: user.id },
            data,
            select: { email: true, firstname: true, lastname: true, picture: true }
        });
        return update;
    }

    async passwordChange(user: User, data: PasswordChange) {
        const getUser = await this.prismaService.user.findFirst({
            where: { id: user.id }
        });

        if (!getUser.password) {
            throw new HttpException("Password has not been set yet", HttpStatus.NOT_FOUND);
        }

        if (data.password === data.newpassword) {
            throw new HttpException("New password can not be the same as old password", HttpStatus.BAD_REQUEST);
        }

        const matchPass = await bcrypt.compare(data.password, getUser.password);

        if (!matchPass) {
            throw new HttpException("Email or password is wrong", HttpStatus.BAD_REQUEST);
        }

        const hashPassword = await bcrypt.hash(data.newpassword, 10);
        await this.prismaService.user.update({
            where: { id: user.id },
            data: {
                password: hashPassword,
            }
        });

        return "Password Changed"
    }

    async passwordSet(user: User, data: PasswordSet) {
        const hashPassword = await bcrypt.hash(data.password, 10);
        await this.prismaService.user.update({
            where: { id: user.id },
            data: {
                password: hashPassword,
            }
        });
        return "Password Set";
    }

    async isPasswordSet(user: User) {
        const getUser = await this.prismaService.user.findFirst({ where: { id: user.id } });
        return Boolean(getUser.password);
    }
}