import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ITask } from './task.interface';
import { TaskService } from './task.service';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { IUser } from '../user/user.interface';

@Controller('tasks')
export class TaskController {
  constructor(
    private taskService: TaskService,
    private userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  find(@Query('user') username: string, @Request() req) {
    const user: IUser = req.user;
    if (!this.userService.hasPermission(user, username)) {
      throw new UnauthorizedException();
    }

    return this.taskService.findByUser(username);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() task: ITask, @Request() req) {
    const user: IUser = req.user;
    return this.taskService.create(task, user.username);
  }
}
