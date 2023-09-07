import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { BaseEntity, FindOptionsWhere } from 'typeorm';
import { HttpError, ERRORS } from '../utils/error.util';

@Injectable()
export class ExistsMiddleware<T extends BaseEntity> implements NestMiddleware {
  constructor(private readonly model: typeof BaseEntity) { }

  static forModel(model: typeof BaseEntity) {
    const middleware = new ExistsMiddleware(model);
    return (req: Request, res: Response, next: NextFunction) => middleware.use(req, res, next);
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const item = await this.model.findOne({ where: { id } as unknown as FindOptionsWhere<T> });
      if (!item) {
        throw new HttpError(400, `${this.model.name} does not exist`, ERRORS.NOT_FOUND(this.model.name), {
          id,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}
