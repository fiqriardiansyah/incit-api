import { Body, Controller, Get, Patch, Post } from "@nestjs/common";
import { User } from "@prisma/client";
import { Auth } from "src/common/auth.decorator";
import { PasswordChange, PasswordSet } from "src/model/user";
import { UserService } from "./user.service";

@Controller("/user")
export class UserController {
    constructor(private userService: UserService) { }

    @Get("profile")
    async profile(@Auth() user: User) {
        const result = await this.userService.profile(user);
        return {
            data: result,
        }
    }

    @Get("is-password-set")
    async isPasswordSet(@Auth() user: User) {
        const result = await this.userService.isPasswordSet(user);
        return {
            data: result,
        }
    }

    @Patch("profile")
    async profileUpdate(@Auth() user: User, @Body() data: Partial<User>) {
        const result = await this.userService.profileChange(user, data);
        return {
            data: result,
        }
    }

    @Patch("password-update")
    async passwordUpdate(@Auth() user: User, @Body() data: PasswordChange) {
        const result = await this.userService.passwordChange(user, data);
        return {
            data: result,
        }
    }

    @Patch("password-set")
    async passwordSet(@Auth() user: User, @Body() data: PasswordSet) {
        const result = await this.userService.passwordSet(user, data);
        return {
            data: result,
        }
    }

}