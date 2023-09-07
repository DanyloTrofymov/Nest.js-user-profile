
import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserId, IUserUpdate, IUserUsername } from './user.type';
import { ERRORS, HttpError } from '../utils/error.util';
import { IUserChangePassword } from '../auth/auth.type';
import { compare } from 'bcrypt';
import { hashPassword } from '../utils/auth.util';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) { }

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

}
