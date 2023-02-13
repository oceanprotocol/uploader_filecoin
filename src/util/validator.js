import { isAddress } from 'web3-utils';
import AppError from './error';

export const SchemaValidator = (schema, options) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, options);
  if (error) {
    next(new AppError(error, 406, 'ValidationError'));
  } else {
    req.body = value;
    next();
  }
};

export const addressValidator = (value, helpers) => {
  if (isAddress(value?.toLowerCase())) {
    return value.toLowerCase();
  }
  return helpers.message('Invalid address');
};
