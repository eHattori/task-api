import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../user/user.model';

describe('AuthController', () => {
  let controller: AuthController;
  const mockService = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: mockService,
          },
        },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    mockService.mockReturnValue([]);
    expect(controller).toBeDefined();
  });
});
