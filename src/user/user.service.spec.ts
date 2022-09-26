import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { UserService } from './user.service';
import { User } from './user.model';
import { Task } from '../task/task.model';

describe('UserService', () => {
  let service: UserService;
  let model;
  let client;
  let taskModel;

  const mockUserModel = () => ({
    findOne: jest.fn(),
    findAll: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User), useFactory: mockUserModel },
        {
          provide: 'PUB_SERVICE',
          useValue: {
            send: jest.fn(() => ({
              toPromise: jest.fn()
            })),
            connect: jest.fn(),
            close: jest.fn(),
            routingMap: jest.fn(),
          },
        },
        {
          provide: getModelToken(Task),
          useValue: {
            user: {
              username: 'test',
            },
          },
        },
      ],
    }).compile();

    service = await module.get<UserService>(UserService);
    model = await module.get(getModelToken(User));
    client = await module.get('PUB_SERVICE');
    taskModel = await module.get(getModelToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Permission User =>', () => {
    const userTest = {
      username: 'test',
      manager: true,
    };

    it('should return true if manager user', () => {
      const expectedResult = true;
      expect(service.hasPermission(userTest)).toBe(expectedResult);
    });

    it('should return true if not manager user but the user try access the own resource', () => {
      const expectedResult = true;
      userTest.manager = false;

      expect(service.hasPermission(userTest, userTest.username)).toBe(
        expectedResult,
      );
    });
    it('should return false if not manager user and is a different user', () => {
      const expectedResult = false;
      userTest.manager = false;

      expect(service.hasPermission(userTest, 'otherUser')).toBe(expectedResult);
    });
  });

  describe('FindOne', () => {
    it('should find one user bt username', async () => {
      model.findOne.mockResolvedValue({ id: 1 });

      const result = await service.findOne('username');
      expect(result.id).toBe(1);
    });
  });

  describe('NotifyManagers', () => {
    it('should notify users managers', async () => {
      taskModel.id = 1;
      const spy = jest.spyOn(client, 'send');
      model.findAll.mockResolvedValue([{ id: 1 }]);
      await service.notifyManagers(taskModel);
      expect(spy).toBeCalled();
    });
  });
});
