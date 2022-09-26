import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
  Query,
  UnauthorizedException,
  NotFoundException,
  Delete,
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

  private handlePermission(user: IUser, username?: string) {
    if (!this.userService.hasPermission(user, username)) {
      throw new UnauthorizedException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  find(@Query('username') username: string, @Request() req) {
    const user: IUser = req.user;
    this.handlePermission(user, username);
    if (username) {
      return this.taskService.findByUser(username);
    } else {
      return this.taskService.findAll();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async findById(@Param('id') taskId: number, @Request() req) {
    const user: IUser = req.user;
    this.handlePermission(user);

    const task = await this.taskService.findById(taskId);
    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() task: ITask, @Request() req) {
    const user: IUser = req.user;
    const newTask = await this.taskService.create(task, user.username);
    if (!user.manager) {
      this.userService.notifyManagers(newTask);
    }

    return newTask;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async update(
    @Body() task: ITask,
    @Param('id') taskId: number,
    @Request() req,
  ) {
    const user: IUser = req.user;
    const oldTask = await this.taskService.findById(taskId);
    if (!oldTask) {
      throw new NotFoundException();
    }
    this.handlePermission(user, oldTask.user.username);

    return this.taskService.update(oldTask, task);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async delete(@Param('id') taskId: number, @Request() req) {
    const user: IUser = req.user;

    const task = await this.taskService.findById(taskId);
    if (!task) {
      throw new NotFoundException();
    }

    this.handlePermission(user, task.user.username);

    this.taskService.delete(taskId);
    return task;
  }
}
