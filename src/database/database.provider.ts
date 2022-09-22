import { SequelizeModule } from '@nestjs/sequelize';

export const databaseProviders = [
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
];
