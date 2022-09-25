import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { UserService } from './user.service';
import { User } from './user.model';
import { Transport, ClientsModule } from '@nestjs/microservices';

describe('UserService', () => {
  let service: UserService;
  const mockUserModel = () => ({
    findOne: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: 'PUB_SERVICE',
            transport: Transport.REDIS,
          },
        ]),
      ],
      providers: [
        UserService,
        { provide: getModelToken(User), useFactory: mockUserModel },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
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
});
