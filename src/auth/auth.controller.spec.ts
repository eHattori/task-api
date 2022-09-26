import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { IUser } from 'src/user/user.interface';

describe('AuthController', () => {
  let controller: AuthController;
  const mockLogin = jest.fn();

  const user: IUser = {
    username: 'hattori',
    password: 'changeme',
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: mockLogin,
          },
        },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('LOGIN=> /login', () => {
    it('should login from user', async () => {
      const expectedResult = {
        access_token: 'MOCK_TOKEN',
      };
      mockLogin.mockResolvedValue(expectedResult);
      expect(await controller.login(user)).toBe(expectedResult);
    });

    it('should throw UnauthorizedException', async () => {
      mockLogin.mockRejectedValue(new UnauthorizedException());
      expect(async () => {
        await controller.login(user);
      }).rejects.toThrow(UnauthorizedException);
    });
  });
});
