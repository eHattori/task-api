import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

describe('TaskController', () => {
  let controller: TaskController;

  beforeEach(async (): Promise<void> => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {
            findByUser: jest.fn(() => []),
          },
        },
      ],
    }).compile();

    controller = app.get<TaskController>(TaskController);
  });

  describe('GET-> /tasks', () => {
    it('should return an array of tasks', async () => {
      const result = await controller.find();
      expect(result !== null).toBeTruthy();
    });
  });
});
