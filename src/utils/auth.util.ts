import { hash, genSalt } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ERRORS, HttpError } from './error.util';
import { User } from '../user/user.entity';

export async function hashPassword(password: string): Promise<string> {
  const saltRoulds = process.env.SALT_ROUNDS;
  if (!saltRoulds) {
    throw new HttpError(500, 'Enviromental variables error', ERRORS.INTERNAL_ERROR);
  }
  const salt = await genSalt(Number(saltRoulds));
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
}

export function generateToken(user: User): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new HttpError(500, 'Enviromental variables error', ERRORS.INTERNAL_ERROR);
  }
  const token = jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '1h' });
  return token;
}
