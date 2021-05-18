import Joi from 'joi';

export function validateVote(vote) {
  const schema = Joi.array().items(
    Joi.object({
      phone: Joi.string().required(),
      candidate_id: Joi.number().required(),
      position_id: Joi.number().required(),
    })
  );
  return schema.validate(vote);
}

export function validateBarChart(position) {
  const schema = Joi.object({
    position: Joi.number().required(),
  });
  return schema.validate(position);
}
