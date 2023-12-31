import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { APP_FILTER } from '@nestjs/core';
import { ErrorHandler } from './middleware/errorHandler.middleware';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        database: process.env.POSTGRES_DB,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        entities: [User],
        synchronize: true
      })
    }),
    UserModule
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, AuthService,
    {
      provide: APP_FILTER,
      useClass: ErrorHandler,
    },],
})
export class AppModule { }
