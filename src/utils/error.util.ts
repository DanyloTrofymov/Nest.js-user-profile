export class HttpError extends Error {
  status: number;

  message: string;

  code: string;

  errors: any;

  constructor(status: number, message: string, code?: string, errors?: any) {
    super(message);
    this.status = status;
    this.message = message;
    this.code = code || '';
    this.errors = errors;
  }
}

export const ERRORS = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  USERNAME_EXISTS: 'USERNAME_EXISTS',
  BAD_TOKEN: 'BAD_TOKEN',
  SESSION_REQUIRED: 'SESSION_REQUIRED',
  BAD_PASSWORD: 'BAD_PASSWORD',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: (model: string) => `${model.toUpperCase()}_NOT_FOUND`
};

export const throwError = (type: string, message: string, data = {}) => {
  throw new HttpError(400, message, type, data);
};
