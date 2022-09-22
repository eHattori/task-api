import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Task extends Model {

  @Column
  summary: string;

  @Column
  date: Date;
}
