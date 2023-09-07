import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ExistsMiddleware } from '../middleware/isExists.middleware';
import { AuthMiddleware } from '../middleware/auth.middlewate';
import { ValidateBodyMiddleware } from '../middleware/validateBody.middleware';
import { userSchema } from '../utils/validationSchema';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  MulterModule.register({
    dest: './uploads',
  }),
  ],
  controllers: [UserController],
  providers: [UserService],
})

export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExistsMiddleware.forModel(User)).forRoutes('*');
    consumer.apply(AuthMiddleware).forRoutes('*');
    consumer.apply(ValidateBodyMiddleware.forSchema(userSchema)).forRoutes('update/:id', 'change-password/:id');
  }
}
