import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';
import { Transport, ClientsModule } from '@nestjs/microservices';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './task.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Task, User]),
    ClientsModule.register([
      {
        name: 'PUB_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: 6379,
        },
      },
    ]),
  ],
  controllers: [TaskController],
  providers: [TaskService, UserService],
})
export class TaskModule {}
