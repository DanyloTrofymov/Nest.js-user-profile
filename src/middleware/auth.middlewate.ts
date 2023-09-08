import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as passport from 'passport';
import { ERRORS, HttpError } from 'src/utils/error.util';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('bearer', { session: false }, (err, user) => {
      if (err) {
        console.log(err);
        throw new HttpError(403, 'Auth error', ERRORS.BAD_TOKEN);
      }

      if (!user) {
        throw new HttpError(403, 'Auth error', ERRORS.UNAUTHORIZED);
      }

      req.user = user;
      next();
    })(req, res, next);
  }
}
