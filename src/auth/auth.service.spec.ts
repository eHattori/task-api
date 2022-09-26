import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { IUser } from '../user/user.interface';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const mockJwt = jest.fn();
  const mockUser = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOne: mockUser,
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: mockJwt,
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('ValidateUser', () => {
    const user: IUser = {
      manager: true,
      username: 'user',
    };
    it('should return a validate user', async () => {
      const user = {
        manager: true,
        username: 'user',
      };

      mockUser.mockResolvedValue({
        ...user,
        password: 'pass',
        validatePassword: jest.fn(() => true),
      });

      const result = await service.validateUser('user', 'pass');

      expect(result.manager).toBe(user.manager);
      expect(result.username).toBe(user.username);
    });

    it('should return a null user', async () => {
      mockUser.mockResolvedValue({
        ...user,
        password: 'pass',
        validatePassword: jest.fn(() => null),
      });

      const result = await service.validateUser('user', 'pass');

      expect(result).toBeNull();
    });

    describe('Login', () => {
      it('should generate a access token', async () => {
        const expectedResult = 'MOCK_TOKEN';
        mockJwt.mockReturnValue(expectedResult);

        const result = await service.login(user);
        expect(result.access_token).toBe(expectedResult);
      });
    });
  });
});
