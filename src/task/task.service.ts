import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.model';
import { ITask } from './task.interface';
import { User } from '../user/user.model';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task) private taskModel: typeof Task,
    @InjectModel(User) private userModel: typeof User
  ) {}

  async findByUser(username: string): Promise<ITask[]> {
    const user = await this.userModel.findOne({
      where: { username: username },
      include: Task,
    });
    const tasks: ITask[] = user.tasks;

    return tasks;
  }

  async create(task, username: string): Promise<any> {
    const user: User = await this.userModel.findOne({
      where: { username: username },
    });
    task.userId = user.id;
    return await this.taskModel.create<Task>(task);
  }
}
