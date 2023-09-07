import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { HttpError } from '../utils/error.util';

@Catch(Error)
export class ErrorHandler implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception instanceof HttpError ? exception.status : 500;

    const errorResponse = {
      status: 0,
      fields: exception instanceof HttpError ? exception.code : {},
      message: exception.message || 'Please, contact your system administrator',
    };
    response.status(status).json(errorResponse);
  }
}
