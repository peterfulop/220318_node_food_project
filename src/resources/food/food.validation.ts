import Joi from 'joi';
import { FoodEntryDetails } from '../food/food.interface';

const foodDetailsValidation = (details: FoodEntryDetails, helpers: Joi.CustomHelpers) => {
  for (const obj of Object.values(details)) {
    if (!obj.amount || typeof obj.amount !== 'number' || !obj.unit || typeof obj.unit !== 'string') {
      return helpers.message({
        custom: 'Invalid object format: [unit as string] && [amount as number]!',
      });
    }
  }
  return details;
};

const create = Joi.object({
  name: Joi.string().required(),
  details: Joi.object().custom(foodDetailsValidation),
});

export default { create };
