
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserSignup } from './auth.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) { }


  async signUp(user: IUserSignup): Promise<User> {
    return await this.userRepository.save(user);
  }

}
