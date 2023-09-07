import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ExistsMiddleware } from '../middleware/isExists.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})

export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExistsMiddleware.forModel(User)).forRoutes();
  }
}
