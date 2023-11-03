const Joi = require('joi');
const { SchemaValidator } = require('../../util/validator');

const createOptions = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
};

const fileSchema = Joi.object({
  content_type: Joi.string().optional(), // optional field
  ipfs_uri: Joi.string()
    .pattern(/^ipfs:\/\//i)
    .required(), // required field with pattern check
}).required();

const uploadInputSchema = Joi.object({
  quoteId: Joi.string().required().min(0),
  nonce: Joi.number().required().min(0),
  signature: Joi.string().required(),
  files: Joi.array().min(1).required().items(fileSchema), // using the updated fileSchema
});

const uploadInputSchemaValidator = SchemaValidator(
  uploadInputSchema,
  createOptions
);

module.exports = {
  uploadInputSchemaValidator,
};
