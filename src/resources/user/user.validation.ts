import Joi from 'joi';

const create = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')),
});

const update = Joi.object({
  username: Joi.string(),
  email: Joi.string().email(),
});

const login = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export default { create, update, login };
