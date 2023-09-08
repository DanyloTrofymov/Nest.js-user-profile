import { Controller, Delete, Get, Param, Patch, Res, UploadedFile, UseInterceptors, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { User } from './user.entity';
import { UserService } from './user.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { IUserUpdate } from './user.type';
import { IUserChangePassword } from 'src/auth/auth.type';
import { FileInterceptor } from '@nestjs/platform-express';;


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get(':id')
  async getOneById(@Param('id') id: string): Promise<User | null> {
    return await this.userService.getOneById({ id });
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

  @Patch('upload-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() image, @Req() req: Request): Promise<object> {
    const id = req?.user.id;
    return await this.userService.uploadImage(id, image);
  }

  @Get('/image/:filename')
  async getImage(@Param('filename') image: string, @Res() res: Response): Promise<void> {
    const fileStream = await this.userService.getImage(image);
    res.setHeader('Content-Type', 'image/jpeg');
    fileStream.pipe(res);
  }
}
