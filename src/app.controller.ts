import { Controller } from '@nestjs/common';
import { UserService } from './user/user.service';

@Controller('api')
export class AppController {
  constructor(private readonly userService: UserService) {}
}
