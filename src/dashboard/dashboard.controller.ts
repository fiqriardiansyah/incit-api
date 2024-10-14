import { Controller, Get } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { Auth } from "src/common/auth.decorator";
import { User } from "@prisma/client";

@Controller("/dashboard")
export class DashboardController {
    constructor(private dashboardService: DashboardService) { }

    @Get("list-user")
    async userList(@Auth() user: User) {
        const result = await this.dashboardService.userList(user);
        return {
            data: result,
        }
    }

    @Get("count-signup")
    async countSignup(@Auth() user: User) {
        const result = await this.dashboardService.countSignup();
        return {
            data: result,
        }
    }

    @Get("count-active-today")
    async countActiveToday(@Auth() user: User) {
        const result = await this.dashboardService.countActiveToday();
        return {
            data: result,
        }
    }

    @Get("count-average-7-day")
    async averageActiveIn7Day(@Auth() user: User) {
        const result = await this.dashboardService.averageActiveIn7Day();
        return {
            data: result,
        }
    }
}