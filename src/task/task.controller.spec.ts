import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { UserService } from '../user/user.service';
import { getModelToken } from '@nestjs/sequelize';
import { Task } from './task.model';
import { User } from '../user/user.model';
import { ITask } from './task.interface';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Transport, ClientsModule } from '@nestjs/microservices';

describe('TaskController', () => {
  let controller: TaskController;
  let service;
  let taskModel;

  beforeEach(async (): Promise<void> => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      imports: [
        ClientsModule.register([
          {
            name: 'PUB_SERVICE',
            transport: Transport.REDIS,
           },
        ]),
      ],
      providers: [
        TaskService,
        {
          provide: TaskService,
          useValue: {
            findById: jest.fn(),
            findByUser: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        UserService,
        {
          provide: getModelToken(Task),
          useValue: {
            findAll: jest.fn(() => []),
            save: jest.fn(),
            user: jest.fn(),
            notifyManagers: jest.fn(),
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
    service = app.get(TaskService);
    taskModel = app.get(getModelToken(Task));
  });

  describe('GET-> /tasks', () => {
    it('should return an array of tasks by user', async () => {
      service.findByUser.mockResolvedValue([{ id: 1 }]);
      const result = await controller.find('hattori', {
        user: { manager: true, username: 'hattori' },
      });
      expect(result).toBeTruthy();
    });

    it('should return all array of tasks', async () => {
      service.findAll.mockResolvedValue([{ id: 1 }]);
      const result = await controller.find(undefined, {
        user: { manager: true, username: 'hattori' },
      });
      expect(result).toBeTruthy();
    });

    it('should return a task by ID', async () => {
      service.findById.mockResolvedValue({ id: 1 });

      const result = await controller.findById(1, {
        user: { manager: true, username: 'hattori' },
      });
      expect(result).toBeTruthy();
    });

    it('should throw a NotFoundException', async () => {
      service.findById.mockResolvedValue(null);

      expect(async () => {
        await controller.findById(1, {
          user: { manager: true, username: 'hattori' },
        });
      }).rejects.toThrow(NotFoundException);
    });
  });

  describe('POST-> /tasks', () => {
    it('should create a task', async () => {
      service.create.mockResolvedValue({ id: 1 });
      const task: ITask = {
        summary: 'text',
      };
      const result = await controller.create(task, {
        user: { manager: true, username: 'hattori' },
      });
      expect(result).toBeTruthy();
    });
  });

  describe('PUT-> /tasks', () => {
    it('should update a task', async () => {
      taskModel.user.mockReturnValue({ username: 'hattori' });
      taskModel.save.mockResolvedValue({});
      service.update.mockResolvedValue({ id: 1 });
      service.findById.mockResolvedValue(taskModel);

      const task: ITask = {
        summary: 'update',
      };
      const result = await controller.update(task, 1, {
        user: { manager: true, username: 'hattori' },
      });
      expect(result).toBeTruthy();
    });

    it('should throw a NotFoundException', async () => {
      service.findById.mockResolvedValue(null);

      const task: ITask = {
        summary: 'update',
      };

      expect(async () => {
        await controller.update(task, 1, {
          user: { manager: true, username: 'hattori' },
        });
      }).rejects.toThrow(NotFoundException);
    });
  });

  describe('DELETE-> /tasks', () => {
    it('should delete a task by ID', async () => {
      taskModel.user.mockReturnValue({ username: 'hattori' });
      taskModel.save.mockResolvedValue({});
      service.delete.mockResolvedValue({ id: 1 });
      service.findById.mockResolvedValue(taskModel);

      const result = await controller.delete(1, {
        user: { manager: true, username: 'hattori' },
      });
      expect(result).toBeTruthy();
    });

    it('should throw a NotFoundException', async () => {
      service.findById.mockResolvedValue(null);

      expect(async () => {
        await controller.delete(1, {
          user: { manager: true, username: 'hattori' },
        });
      }).rejects.toThrow(NotFoundException);
    });
  });
});
