import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { ValidateBodyMiddleware } from '../middleware/validateBody.middleware';
import { userSchema } from '../utils/validationSchema';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateBodyMiddleware.forSchema(userSchema)).forRoutes('your-route');
  }
}
