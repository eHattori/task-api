import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { DatabaseModule } from '../database/database.module';
import { TaskService } from './task.service';
import { tasksProviders } from './task.providers';

describe('TaskController', () => {
  let controller: TaskController;

  beforeEach(async (): Promise<void> => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [TaskController],
      providers: [TaskService, ...tasksProviders],
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
