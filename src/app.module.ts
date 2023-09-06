import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';

import { DatabaseModule } from './modules/database.module';

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
