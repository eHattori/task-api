import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { DatabaseModule } from '../database/database.module';
import { Task } from './task.entity';
import { SequelizeModule } from '@nestjs/sequelize';

describe('TaskController', () => {
  let controller: TaskController;

  beforeEach(async (): Promise<void> => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, SequelizeModule.forFeature([Task])],
      controllers: [TaskController],
      providers: [TaskService],
    }).compile();

    controller = app.get<TaskController>(TaskController);
  });

  describe('GET-> /tasks', () => {
    it('should return an array of tasks', async () => {
      const result = await controller.findAll();
      expect(result !== null).toBeTruthy();
    });
  });
});
