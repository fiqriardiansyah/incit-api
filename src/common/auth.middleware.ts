import { HttpException, Injectable, NestMiddleware } from "@nestjs/common";
import { User } from "@prisma/client";
import { Request, Response } from "express";
import { PrismaService } from "./prisma.service";

export interface RequestUser extends Request {
    user?: User & {
        token: string;
    }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {

    constructor(private readonly prismaService: PrismaService) { }

    async use(req: RequestUser, res: Response, next: (error?: Error | any) => void) {

        const token = req.cookies['token'] || req.headers['Authorization'] || req.headers['authorization'];

        if (!token) {
            throw new HttpException("Authorization token not found", 401)
        }

        const user = await this.prismaService.$queryRawUnsafe(`SELECT * FROM "oauthtoken"
            INNER JOIN "user"
            ON "oauthtoken"."userid" = "user"."id"
            WHERE "oauthtoken"."accesstoken" = $1
        `, token) as User[];

        if (!user?.length) {
            throw new HttpException("No User found", 401)
        }

        req.user = {
            ...user[0],
            token,
        } as RequestUser["user"];

        next();
    }
}