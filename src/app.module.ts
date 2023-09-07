import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { DatabaseModule } from './database/database.module';
import { TryCatchMiddleware } from './middleware/tryCatch.middleware';
import { APP_FILTER } from '@nestjs/core';
import { ErrorHandler } from './middleware/errorHandler.moddleware';

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [AppController, UserController],
  providers: [UserService, TryCatchMiddleware,
    {
      provide: APP_FILTER,
      useClass: ErrorHandler,
    },],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TryCatchMiddleware).forRoutes('*');
  }
}
