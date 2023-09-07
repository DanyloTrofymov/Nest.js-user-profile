import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TryCatchMiddleware implements NestMiddleware {
  constructor(private handler: (req: Request, res: Response, next: NextFunction) => Promise<any>) { }
  use(req: Request, res: Response, next: NextFunction) {
    try {
      this.handler(req, res, next);
    } catch (err) {
      next(err);
    }
  }
}
