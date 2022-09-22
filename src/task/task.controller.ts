import { Controller, Get } from '@nestjs/common';
import { ITask } from './task.interface';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService){}

  @Get()
  findAll(): Promise<ITask[]> {
    return this.taskService.findByUser(1);  }
}
