import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';

import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './task.model';

@Module({
  imports: [SequelizeModule.forFeature([Task, User])],
  controllers: [TaskController],
  providers: [TaskService, UserService],
})
export class TaskModule {}
