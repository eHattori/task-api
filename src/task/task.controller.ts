import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ITask } from './task.interface';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService){}

  @UseGuards(JwtAuthGuard)
  @Get()
  find(@Request() req): Promise<ITask[]> {
    console.log(req.user)
    return this.taskService.findByUser(1);  }
}
