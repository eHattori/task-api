import { Column, Table, Model } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column
  username: string;
  @Column
  password: string;
  @Column
  manager: boolean;
}
