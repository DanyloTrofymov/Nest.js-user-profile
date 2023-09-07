import { Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { ERRORS, HttpError } from '../utils/error.util';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy, 'bearer') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.getOneById(payload.sub);

    if (!user) {
      throw new HttpError(403, 'Auth error', ERRORS.UNAUTHORIZED);
    }

    return user;
  }
}
