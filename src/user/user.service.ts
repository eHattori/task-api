import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IUser } from './user.interface';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({
      where: { username: username },
    });
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
