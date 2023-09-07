import { Controller, Get, Param } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('USER_CONTROLLER')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get(':id')
  async getOneById(@Param('id') id: string): Promise<User | null> {
    return this.userService.getOneById({ id });
  }
}
