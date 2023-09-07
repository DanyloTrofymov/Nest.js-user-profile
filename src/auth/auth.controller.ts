import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { IUserRestorePassword, IUserSignIn, IUserSignUp } from './auth.type';
import { AuthService } from './auth.service';
import { IUser } from '../user/user.type';

@Controller('Auth_CONTROLLER')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Post('signup')
  async signUp(@Body() data: IUserSignUp): Promise<IUser> {
    return await this.authService.signUp(data);
  }
  @Post('signin')
  async signIn(@Body() data: IUserSignIn): Promise<IUser> {
    return await this.authService.signIn(data);
  }
  @Patch('confirm/:token')
  async confirm(@Param('token') token: string): Promise<IUser> {
    return await this.authService.emailConfirmation(token)
  }
  @Post('forgot-password')
  async forgotPassword(@Body() email: string): Promise<IUser> {
    return await this.authService.forgotPassword(email);
  }
  @Patch('forgot-password/:token')
  async restorePassword(@Param('token') token: string, @Body() data: IUserRestorePassword): Promise<IUser> {
    return await this.authService.restorePassword(token, data);
  }
}
