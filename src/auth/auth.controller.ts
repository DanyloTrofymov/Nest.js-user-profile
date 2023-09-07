import { Controller, Post, Body } from '@nestjs/common';
import { IUserSignup } from './auth.type';
import { AuthService } from './auth.service';
import { User } from 'src/user/user.entity';

@Controller('Auth_CONTROLLER')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Post('signup')
  async signUp(@Body() data: IUserSignup): Promice<User> {
    return this.authService.register(data);
  }
}
