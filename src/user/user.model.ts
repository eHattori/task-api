import {
  Column,
  Table,
  Model,
  BeforeCreate,
  Unique,
  HasMany,
} from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';
import { Task } from '../task/task.model';

@Table
export class User extends Model {
  @Unique
  @Column
  username: string;

  @Column
  password: string;

  @Column
  manager: boolean;

  @HasMany(() => Task)
  tasks: Task[];

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  @BeforeCreate
  static encryptPassword(user: User) {
    user.password = bcrypt.hashSync(user.password, 8);
  }
}
