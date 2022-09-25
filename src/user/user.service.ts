import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';
import { IUser } from './user.interface';
import { User } from './user.model';
import { Task } from 'src/task/task.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @Inject('PUB_SERVICE') private client: ClientProxy,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({
      where: { username: username },
    });
  }

  async notifyManagers(task: Task) {
    const managers: User[] = await this.userModel.findAll({
      where: { manager: true },
    });
    for (const manager of managers) {
      const message = `The tech ${task.user.username} performed the task ${task.id} on date ${task.createdAt}`;
      await this.client.send({ type: 'event' }, message).toPromise();
    }
  }

  hasPermission(user: IUser, otherUser?: string) {
    if (user.manager) {
      return true;
    } else {
      if (otherUser == user.username) {
        return true;
      }
    }
    return false;
  }
}
