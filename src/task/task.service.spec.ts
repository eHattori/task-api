import { Test, TestingModule } from '@nestjs/testing';
import { Task } from './task.model';
import { User } from '../user/user.model';
import { TaskService } from './task.service';
import { getModelToken } from '@nestjs/sequelize';

describe('TaskService', () => {
  let taskService: TaskService;
  let taskModel;
  let userModel;

  const mockTaskModel = () => ({
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    destroy: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  });

  const mockUserModel = () => ({
    findOne: jest.fn(),
  });

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getModelToken(Task),
          useFactory: mockTaskModel,
        },
        {
          provide: getModelToken(User),
          useFactory: mockUserModel,
        },
      ],
    }).compile();

    taskService = await app.get<TaskService>(TaskService);
    taskModel = await app.get(getModelToken(Task));
    userModel = await app.get(getModelToken(User));
  });

  describe('create Task', () => {
    it('should create a task', async () => {
      userModel.findOne.mockResolvedValue({ id: 1 });
      taskModel.create.mockResolvedValue({ id: 1 });
      jest.spyOn(taskService, 'findById').mockResolvedValue(taskModel);
      const taskCreate = {
        summary: 'summary',
      };

      const result = await taskService.create(taskCreate, 'user_test');
      expect(result).toBeTruthy();
    });
  });

  describe('update Task', () => {
    it('should update a task', async () => {
      taskModel.save.mockResolvedValue({ id: 1 });
      const taskUpdated = {
        summary: 'update',
      };

      const result = await taskService.update(taskModel, taskUpdated);
      expect(result).toBeTruthy();
    });
  });

  describe('find Tasks by user', () => {
    it('should get all tasks for user', async () => {
      userModel.findOne.mockResolvedValue({ id: 1, tasks: [{ id: 1 }] });
      taskModel.findAll.mockResolvedValue([{ id: 1 }]);

      const result = await taskService.findByUser('user_test');
      expect(result).toBeTruthy();
    });

    it('should get all tasks', async () => {
      taskModel.findAll.mockResolvedValue([{ id: 1 }]);

      const result = await taskService.findAll();
      expect(result).toBeTruthy();
    });

    it('should get task by id', async () => {
      taskModel.findOne.mockResolvedValue({ id: 1 });

      const result = await taskService.findById(1);
      expect(result).toBeTruthy();
    });
  });

  describe('delete Task', () => {
    it('should delete a task', async () => {
      taskModel.destroy.mockResolvedValue({ id: 1 });

      const result = await taskService.delete(1);
      expect(result).toBeTruthy();
    });
  });
});
