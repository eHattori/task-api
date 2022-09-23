import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      database: process.env.DB_DATABASE || 'task',
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      dialect: 'mysql',
      port: parseInt(process.env.DB_PORT) || 3306,
      host: process.env.DB_HOST || 'localhost',
      autoLoadModels: true,
      synchronize: true,
    }),
    TaskModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
