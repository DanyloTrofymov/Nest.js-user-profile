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
import { BearerStrategy } from 'src/auth/bearer.stratrgy';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  MulterModule.register({
    dest: './uploads',
  }),
  ],
  controllers: [UserController],
  providers: [UserService, BearerStrategy],
})

export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExistsMiddleware.forModel(User)).forRoutes('user/*');
    consumer.apply(AuthMiddleware).forRoutes('user/*');
    consumer.apply(ValidateBodyMiddleware.forSchema(userSchema)).forRoutes('user/update/:id', 'user/change-password/:id');
  }
}
