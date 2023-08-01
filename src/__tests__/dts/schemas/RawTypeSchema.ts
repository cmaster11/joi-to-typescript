import Joi from "joi";

export const RawTypeSchema = Joi.array().items(Joi.object()).meta({className: 'RawType'});
