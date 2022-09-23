import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ where: { username: username } });
  }
}
