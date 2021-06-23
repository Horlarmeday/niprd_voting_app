import Joi from 'joi';

export function validateLogin(req) {
  const schema = Joi.object({
    phone: Joi.string().required(),
    password: Joi.string().required(),
  });
  return schema.validate(req);
}
