import Joi from 'joi';
import config from '../../config';
import { SchemaValidator, addressValidator } from '../../util/validator';

export const createOptions = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
};

const getQuoteInputSchema = Joi.object({
  type: Joi.string()
    .insensitive()
    .valid('filecoin', 'lighthouseStorage')
    .required(),
  duration: Joi.number().required().min(0),
  userAddress: Joi.string().custom((value, helper) =>
    addressValidator(value, helper)
  ),
  payment: Joi.object({
    chainId: Joi.number()
      .required()
      .valid(...Object.keys(config.contractInfo).map((e) => +e)),
    tokenAddress: Joi.string()
      .required()
      .lowercase()
      .custom((value, helper) => addressValidator(value, helper)),
  }).required(),
  files: Joi.array()
    .min(1)
    .required()
    .items(Joi.object({ length: Joi.number().min(0) })),
}).custom((values, helper) => {
  const [paymentAddress] = (
    Object.values(config.contractInfo[values?.payment?.chainId].currency) ?? []
  ).filter(
    (a) => a.toLowerCase() === values?.payment?.tokenAddress.toLowerCase()
  );
  if (!paymentAddress) {
    return helper.message(
      `TokenAddress not support on chainId ${values?.payment?.chainId}`
    );
  }
  return values;
});

export const getQuoteInputSchemaValidator = SchemaValidator(
  getQuoteInputSchema,
  createOptions
);
