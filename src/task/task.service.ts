import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.model';
import { ITask } from './task.interface';
import { User } from '../user/user.model';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task) private taskModel: typeof Task,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  async findAll(): Promise<ITask[]> {
    return await this.taskModel.findAll();
  }

  async findById(taskId: number) {
    return this.taskModel.findOne({
      where: { id: taskId },
      include: [{ model: User, attributes: ['id', 'username'] }],
    });
  }

  async findByUser(username: string): Promise<ITask[]> {
    const user = await this.userModel.findOne({
      where: { username: username },
    });
    const tasks: ITask[] = await this.taskModel.findAll({
      where: { userId: user.id },
      include: [{ model: User, attributes: ['id', 'username'] }],
    });

    return tasks;
  }

  async create(task, username: string): Promise<any> {
    const user: User = await this.userModel.findOne({
      where: { username: username },
    });
    task.userId = user.id;
    const newTask = await this.taskModel.create<Task>(task);
    return await this.findById(newTask.id);
  }

  async update(createdTask: Task, editedTask: ITask): Promise<any> {
    createdTask.summary = editedTask.summary;

    return await createdTask.save();
  }

  async delete(taskId: number): Promise<any> {
    return this.taskModel.destroy({ where: { id: taskId } });
  }
}
