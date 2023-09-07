
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserId } from './user.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ){}

  public async getOneById(data: IUserId): Promise<User | null> {
    return User.findOneBy({ id: data.id });
  }

}
