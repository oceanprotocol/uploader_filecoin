import AppError from "./error";
import web3 from "web3";
import ABI from "../abi/mini.js";
import { replaceKeyWords } from "./helper";
import { ethers } from "ethers";

export const SchemaValidator = (schema, options) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, options);
  if (error) {
    next(new AppError(error, 406));
  } else {
    req.body = value;
    next();
  }
};

export const addressValidator = (value, helpers) => {
  if (web3.utils.isAddress(value?.toLowerCase())) {
    return value.toLowerCase();
  }
  return helpers.message("Invalid address");
};
