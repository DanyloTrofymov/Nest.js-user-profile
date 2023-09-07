import { Controller, Delete, Get, Param, Patch, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { User } from './user.entity';
import { UserService } from './user.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { IUserUpdate } from './user.type';
import { IUserChangePassword } from 'src/auth/auth.type';
import { FileInterceptor } from '@nestjs/platform-express';
import path from 'path';
import * as fs from 'fs';
import { HttpError } from '../utils/error.util';

@Controller('USER_CONTROLLER')
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
  @Patch('upload-image/:id')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@Param('id') id: string, @UploadedFile() image): Promise<void> {
    return await this.userService.uploadImage({ id, image });
  }

  @Get('/image:filename')
  async getImage(@Param('filename') image: string, @Res() res: Response) {
    const imagePath = path.join('./uploads/', image);
  
    if (fs.existsSync(imagePath)) {
      throw new HttpError(404, 'Image not found');
    }

    const fileStream = fs.createReadStream(imagePath)

    res.setHeader('Content-Type', 'image/jpeg');
    fileStream.pipe(res);
  }
}
