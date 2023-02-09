import web3 from 'web3';
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
  if (web3.utils.isAddress(value?.toLowerCase())) {
    return value.toLowerCase();
  }
  return helpers.message('Invalid address');
};
