import { Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "src/common/prisma.service";

@Injectable()
export class DashboardService {
    constructor(private prismaService: PrismaService) { }

    async countSignup() {
        const count = await this.prismaService.user.count();
        return count;
    }

    async countActiveToday() {
        const count = await this.prismaService.$queryRaw(Prisma.raw(`
            SELECT COUNT(DISTINCT(u.id)) AS "active_today" FROM public.user u JOIN public.oauthtoken o ON u.id = o.userid
            WHERE o.createdat BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '1 day';
        `));

        return Number(count[0].active_today)
    }

    async averageActiveIn7Day() {
        const count = await this.prismaService.$queryRaw(Prisma.raw(`
              SELECT AVG(daily_count) AS avg_active_users
                FROM (
                    SELECT COUNT(DISTINCT u.id) AS daily_count
                    FROM public.user u
                    JOIN public.oauthtoken ot ON u.id = ot.userid
                    WHERE ot.createdat >= CURRENT_DATE - INTERVAL '7 days'
                    GROUP BY DATE(ot.createdat)
                ) AS daily_counts;
        `));

        return Math.floor(Number(count[0].avg_active_users))
    }

    async userList(user: User) {
        const users = this.prismaService.user.findMany({
            select: {
                countlogin: true,
                firstname: true,
                lastname: true,
                logoutat: true,
                picture: true,
                createdat: true,
                id: true,
                email: true,
            },
            orderBy: {
                createdat: "asc",
            }
        });
        return users;
    }
}