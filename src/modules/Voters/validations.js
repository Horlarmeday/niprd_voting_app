import Joi from 'joi';

export function validateVoter(voter) {
  const schema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
  });
  return schema.validate(voter);
}

export function validateCandidate(candidate) {
  const schema = Joi.object({
    name: Joi.string().required(),
    position_id: Joi.number().required(),
  });
  return schema.validate(candidate);
}

export function validatePosition(position) {
  const schema = Joi.object({
    position: Joi.string().required(),
  });
  return schema.validate(position);
}
