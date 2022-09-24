import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { UserService } from '../user/user.service';
import { getModelToken } from '@nestjs/sequelize';
import { Task } from './task.model';
import { User } from '../user/user.model';
import { ITask } from './task.interface';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  beforeEach(async (): Promise<void> => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        TaskService,
        UserService,
        {
          provide: getModelToken(Task),
          useValue: {
            findAll: jest.fn(() => []),
          },
        },
        {
          provide: getModelToken(User),
          useValue: {
            findOne: jest.fn(() => []),
          },
        },
      ],
    }).compile();

    controller = app.get<TaskController>(TaskController);
    service = app.get<TaskService>(TaskService);
  });

  describe('GET-> /tasks', () => {
    const mockFindByUser = jest.fn();

    it('should return an array of tasks', async () => {
      mockFindByUser.mockReturnValue([1]);
      jest.spyOn(service, 'findByUser').mockImplementation(mockFindByUser);
      const result = await controller.find('hattori', {
        user: { manager: true, username: 'hattori' },
      });
      expect(result).toBeTruthy();
    });
  });

  describe('POST-> /tasks', () => {
    const mockCreateTask = jest.fn();

    it('should return an array of tasks', async () => {
      mockCreateTask.mockReturnValue([1]);
      jest.spyOn(service, 'create').mockImplementation(mockCreateTask);
      const task: ITask = {
        summary: 'text',
        date: new Date(),
      };
      const result = await controller.create(task, {
        user: { manager: true, username: 'hattori' },
      });
      expect(result).toBeTruthy();
    });
  });
});
