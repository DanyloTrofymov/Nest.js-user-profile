
import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { User } from '../user/user.entity';
import { IUserRestorePassword, IUserSignIn, IUserSignUp } from './auth.type';
import { ERRORS, HttpError } from '../utils/error.util';
import { generateToken, hashPassword } from '../utils/auth.util';
import { TemplateType, sendEmail } from '../utils/mailer.util';
import { IUser, IUserId } from '../user/user.type';
import { UserService } from '../user/user.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService
  ) { }

  public async getOneByToken(token: string): Promise<User | null> {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      throw new HttpError(403, 'Restore error', ERRORS.BAD_TOKEN);
    }
    const responce = await this.userService.getOneById(decoded as IUserId);
    return responce;
  }

  async signUp(data: IUserSignUp): Promise<IUser> {
    const find = await this.userService.getOneByUsername(data);
    if (find !== null) {
      throw new HttpError(400, 'Username already exists');
    }
    const hashedPassword = await hashPassword(data.password);
    data.password = hashedPassword;
    const responce = User.create({ ...data });
    await responce.save();
    const token = generateToken(responce);
    const mailUrl = `${process.env.FRONTEND_URL}/auth/confirmation/${token}`;
    await sendEmail(data.email, TemplateType.Confirm, mailUrl);
    const user = {
      username: responce.username,
      id: responce.id
    };
    return user;
  }

  public async signIn(data: IUserSignIn): Promise<IUser> {
    const responce = await this.userService.getOneByUsername(data);
    if (responce === null) {
      throw new HttpError(403, 'Incorrect username or password', ERRORS.BAD_PASSWORD);
    }
    const matchPass = await compare(data.password, responce.password);
    if (!matchPass) {
      throw new HttpError(403, 'Incorrect username or password', ERRORS.BAD_PASSWORD);
    }
    if (responce.isActive === false) {
      const token = generateToken(responce);
      const mailUrl = `${process.env.FRONTEND_URL}/auth/confirmation/${token}`;
      await sendEmail(responce.email, TemplateType.Confirm, mailUrl);
      throw new HttpError(403, 'Inactive account. Check mail', ERRORS.UNAUTHORIZED);
    }
    const token = generateToken(responce);
    const user = {
      username: responce.username,
      id: responce.id,
      token
    };
    return user;
  }

  public async forgotPassword(email: string): Promise<IUser> {
    if (!email) {
      throw new HttpError(400, 'Email is required');
    }
    const user = await User.findOneBy({ email });
    if (user === null) {
      throw new HttpError(400, 'User not found');
    }
    const token = generateToken(user);
    const mailUrl = `${process.env.FRONTEND_URL}/auth/forgot-password/${token}`;
    await sendEmail(email, TemplateType.RestorePassword, mailUrl);
    return user;
  }

  public async restorePassword(token: string, data: IUserRestorePassword): Promise<IUser> {
    const responce = await this.getOneByToken(token);
    if (responce === null) {
      throw new HttpError(403, 'Restore error', ERRORS.BAD_TOKEN);
    }
    if (data.password !== data.repeatPassword || !data.password) {
      throw new HttpError(403, 'Incorrect password', ERRORS.BAD_PASSWORD);
    }
    const hashedPassword = await hashPassword(data.password);
    User.update({ id: responce.id }, { password: hashedPassword });
    const newToken = generateToken(responce);
    const user = {
      username: responce.username,
      id: responce.id,
      token: newToken
    };
    return user;
  }

  public async emailConfirmation(token: string): Promise<IUser> {
    const responce = await this.getOneByToken(token);
    if (responce === null) {
      throw new HttpError(403, 'Confirmation error', ERRORS.BAD_TOKEN);
    }
    User.update({ id: responce.id }, { isActive: true });
    const newToken = generateToken(responce);
    const user = {
      username: responce.username,
      id: responce.id,
      token: newToken
    };
    return user;
  }

}
