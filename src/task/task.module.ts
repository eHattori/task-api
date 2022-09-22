import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './task.entity';

@Module({
  imports: [SequelizeModule.forFeature([Task])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
