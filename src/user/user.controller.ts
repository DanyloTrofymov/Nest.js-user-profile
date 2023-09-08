import { Controller, Delete, Get, Param, Patch, Res, UploadedFile, UseInterceptors, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from './user.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { IUserUpdate } from './user.type';
import { IUserChangePassword } from 'src/auth/auth.type';
import { FileInterceptor } from '@nestjs/platform-express';;


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Delete('delete')
  async deleteUser(@Req() req: Request,): Promise<DeleteResult> {
    const id = req?.user.id;
    return await this.userService.deleteOne({ id });
  }

  @Patch('update')
  async updateUser(@Req() req: Request, data: IUserUpdate): Promise<UpdateResult> {
    const id = req?.user.id;
    return await this.userService.updateUser({ id, ...data });
  }

  @Patch('change-password')
  async changePassword(@Req() req: Request, data: IUserChangePassword): Promise<UpdateResult> {
    const id = req?.user.id;
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
