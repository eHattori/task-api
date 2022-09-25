import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { IUser } from 'src/user/user.interface';

describe('AuthController', () => {
  let controller: AuthController;
  const mockLogin = jest.fn();
  const mockProfile = jest.fn();
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
});
