import Joi from 'joi';

const userConstants = {
  usernameMinLength: 8,
  usernameMaxLength: 64,
  passwordMinLength: 8,
  passwordMaxLength: 64
};

export const userSchema = Joi.object({
  id: Joi.string().guid({ version: ['uuidv4', 'uuidv5'] }),
  username: Joi.string()
    .alphanum()
    .min(userConstants.usernameMinLength)
    .max(userConstants.usernameMaxLength),
  email: Joi.string().email(),
  password: Joi.string().min(userConstants.passwordMinLength).max(userConstants.passwordMaxLength),
  repeatPassword: Joi.ref('password'),
  oldPassword: Joi.string()
    .min(userConstants.passwordMinLength)
    .max(userConstants.passwordMaxLength),
  token: Joi.string(),
  user: Joi.object({
    id: Joi.string().guid({ version: ['uuidv4', 'uuidv5'] }),
    username: Joi.string(),
    email: Joi.string(),
    iat: Joi.number(),
    exp: Joi.number()
  })
});
