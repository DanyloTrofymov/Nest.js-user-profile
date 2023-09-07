import { Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { IUserUpdate } from './user.type';
import { IUserChangePassword } from 'src/auth/auth.type';

@Controller('USER_CONTROLLER')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get(':id')
  async getOneById(@Param('id') id: string): Promise<User | null> {
    return await this.userService.getOneById({ id });
  }

  @Get(':username')
  async getOneByUsername(@Param('username') username: string): Promise<User | null> {
    return await this.userService.getOneByUsername({ username });
  }

  @Delete('delete/:id')
  async deleteOne(@Param('id') id: string): Promise<DeleteResult> {
    return await this.userService.deleteOne({ id });
  }

  @Patch('update/:id')
  async updateOne(@Param('id') id: string, data: IUserUpdate): Promise<UpdateResult> {
    return await this.userService.updateUser({ id, ...data });
  }

  @Patch('change-password/:id')
  async changePassword(@Param('id') id: string, data: IUserChangePassword): Promise<UpdateResult> {
    return await this.userService.changePassword({ id, ...data });
  }
}
