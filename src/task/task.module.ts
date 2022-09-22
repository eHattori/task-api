import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TaskService } from './task.service';
import { tasksProviders } from './task.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [TaskController],
  providers: [
    TaskService,
    ...tasksProviders,
  ]
})
export class TaskModule {}
