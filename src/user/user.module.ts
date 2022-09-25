import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { SeederModule } from 'nestjs-sequelize-seeder';
import { UserSeed } from './user.seeder';
import { Transport, ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    SeederModule.forFeature([UserSeed]),
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
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
