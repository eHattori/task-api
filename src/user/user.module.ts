import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { SeederModule } from 'nestjs-sequelize-seeder';
import { UserSeed } from './user.seeder';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    SeederModule.forFeature([UserSeed]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
