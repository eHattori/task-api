import {
  BelongsTo,
  Column,
  Length,
  Model,
  Table,
  CreatedAt,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from '../user/user.model';

@Table
export class Task extends Model {
  @Length({ max: 2500 })
  @Column
  summary: string;

  @CreatedAt
  date: Date;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
