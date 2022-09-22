import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.entity';
import { ITask } from './task.interface';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task) private taskModel: typeof Task) {}

  async findByUser(userId: number): Promise<ITask[]> {
    return new Promise((resolve) => {
      resolve([]);
    });
  }
}
