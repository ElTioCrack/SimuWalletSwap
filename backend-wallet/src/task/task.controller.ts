import { Controller, Get } from '@nestjs/common';

@Controller('task')
export class TaskController {

    @Get()
    helloworld() {
        return "Hello World !!!";
    }
}
