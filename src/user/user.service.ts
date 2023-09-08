
import { Injectable } from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { IUserId, IUserUpdate, IUserUsername } from './user.type';
import { ERRORS, HttpError } from '../utils/error.util';
import { IUserChangePassword } from '../auth/auth.type';
import { compare } from 'bcrypt';
import { hashPassword } from '../utils/auth.util';
import * as fs from 'fs';
import * as sharp from 'sharp';

@Injectable()
export class UserService {
  public async getOneById(data: IUserId): Promise<User | null> {
    return User.findOneBy({ id: data.id });
  }

  public async getOneByUsername(data: IUserUsername): Promise<User | null> {
    return User.findOneBy({ username: data.username });
  }

  public async updateUser(data: IUserUpdate): Promise<UpdateResult> {
    const user = await this.getOneById(data);
    if (user === null) {
      throw new HttpError(400, 'User not found');
    }
    if (data.username !== user.username) {
      const find = await this.getOneByUsername(data);
      if (find !== null) {
        throw new HttpError(400, 'Username already exists');
      }
    }
    if (data.email !== user.email) {
      const find = await this.getOneByUsername(data);
      if (find !== null) {
        throw new HttpError(400, 'Username already exists');
      }
    }
    return User.update({ id: data.id }, { username: data.username, email: data.email });
  }

  public async changePassword(data: IUserChangePassword): Promise<UpdateResult> {
    const user = await this.getOneById(data);
    if (user === null) {
      throw new HttpError(400, 'User not found');
    }
    const matchPass = await compare(data.oldPassword, user.password);
    if (!matchPass) {
      throw new HttpError(403, 'Incorrect password', ERRORS.BAD_PASSWORD);
    }
    const hashedPassword = await hashPassword(data.password);
    return User.update({ id: data.id }, { password: hashedPassword });
  }

  public async deleteOne(data: IUserId): Promise<DeleteResult> {
    return User.delete({ id: data.id });
  }

  public async uploadImage(id: string, image: any): Promise<object> {
    const fileMimetype = '.' + image.mimetype.split('/')[1];
    if (fileMimetype != '.jpeg' && fileMimetype != '.png' && fileMimetype != '.jpg') {
      throw new HttpError(400, 'Invalid file type');
    }
    const imagePath = `./uploads`;
    if (!fs.existsSync(imagePath)) {
      fs.mkdirSync(imagePath);
    }

    const originalImagePath = `${imagePath}/${id}-original${fileMimetype}`;
    fs.writeFileSync(originalImagePath, image.buffer);

    const sizes = [
      { suffix: 'large', width: 800, height: 800 },
      { suffix: 'medium', width: 400, height: 400 },
      { suffix: 'small', width: 200, height: 200 },
    ];

    for (const size of sizes) {
      await sharp(image.buffer)
        .resize(size.width, size.height)
        .toFile(`${imagePath}/${id}-${size.suffix}${fileMimetype}`);
    }

    return { message: 'Image uploaded' };
  }

  public async getImage(image: string): Promise<fs.ReadStream> {
    const imagePath = `./uploads/${image}`;

    if (!fs.existsSync(imagePath)) {
      throw new HttpError(404, 'Image not found');
    }

    const fileStream = fs.createReadStream(imagePath)


    return fileStream;
  }
}
