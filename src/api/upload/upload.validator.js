import Joi from "joi";
import config from "../../config";
import { SchemaValidator } from "../../util/validator";

const createOptions = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
};

const uploadInputSchema = Joi.object({
  quoteId: Joi.string().required().min(0),
  nonce: Joi.number().required().min(0),
  signature: Joi.string().required(),
  files: Joi.array()
    .min(1)
    .required()
    .items(
      Joi.string()
        .pattern(/^ipfs:\/\//i)
        .required()
    ),
});

export const uploadInputSchemaValidator = SchemaValidator(
  uploadInputSchema,
  createOptions
);
