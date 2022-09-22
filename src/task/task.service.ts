import { Inject, Injectable } from '@nestjs/common';
import { Task } from './task.entity';
import { ITask } from './task.interface';

@Injectable()
export class TaskService {
  constructor(@Inject('TASK_REPOSITORY') private taskRepository: typeof Task) {}

  async findByUser(userId: number): Promise<ITask[]> {
    return new Promise((resolve) => {
      resolve([]);
    });
  }
}
