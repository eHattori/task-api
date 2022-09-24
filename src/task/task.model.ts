import { BelongsTo, Column, Model, Table, ForeignKey } from 'sequelize-typescript';
import { User } from '../user/user.model';

@Table
export class Task extends Model {
  @Column
  summary: string;

  @Column
  date: Date;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
