import { Controller, Get } from "@nestjs/common";

@Controller("/")
export class CommonController {

    @Get("")
    main() {
        return {
            data: 'hello world',
            mode: process.env.NODE_ENV
        }
    }
}