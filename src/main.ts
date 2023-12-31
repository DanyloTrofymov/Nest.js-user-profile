import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import './utils/customRequest.util';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 4200);
}
bootstrap();
