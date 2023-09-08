import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { HttpError } from '../utils/error.util';

@Injectable()
export class ValidateBodyMiddleware implements NestMiddleware {
  constructor(private readonly schema: Joi.ObjectSchema) { }

  static forSchema(schema: Joi.ObjectSchema) {
    const middleware = new ValidateBodyMiddleware(schema);
    return (req: Request, res: Response, next: NextFunction) => middleware.use(req, res, next);
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = this.schema.validate(req.body);
      if (error) {
        throw new HttpError(400, error.details.map((detail) => detail.message).join(', '));
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}
