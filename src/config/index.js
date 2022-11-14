import { merge } from "lodash";
import dotenv from "dotenv";
import Joi from "joi";
import paymentAddress from "./paymentAddress";

dotenv.config();
const env = process.env.NODE_ENV || "development";

const baseConfig = {
  env,
  isDev: env === "development",
  isTest: env === "testing",
  port: process.env.PORT ?? 3000,
  depositMumbai: process.env.DepositMumbai,
  erc20Mumbai: process.env.ERC20Mumbai,
  privateKey: process.env.PRIVATE_KEY,
  dbsUrl: process.env.DBS_URL,
  locationUrl: process.env.LOCATION_URL,
  paymentAddress,
  bearer_token: process.env.TOKEN,
  database_sql: process.env.DATABASE_SQL,
  user_sql: process.env.USER_SQL,
  password_sql: process.env.PASSWORD_SQL,
  dataname_sql: process.env.DATANAME_SQL,
  host_sql: process.env.HOST_SQL,
};

let envConfig = {};

switch (env) {
  case "dev":
  case "development":
    envConfig = require("./dev").config;
    break;
  case "test":
  case "testing":
    envConfig = require("./testing").config;
    break;
  case "prod":
  case "production":
    envConfig = require("./prod").config;
    break;
  default:
    envConfig = require("./dev").config;
}

const envVarsSchema = Joi.object({
  paymentAddress: Joi.object().required(),
  port: Joi.number().required(),
  depositMumbai: Joi.string().required(),
  erc20Mumbai: Joi.string().required(),
  user_sql: Joi.string().required(),
  password_sql: Joi.string(),
  dataname_sql: Joi.string().required(),
  database_sql: Joi.string().required(),
  host_sql: Joi.string().required(),
}).unknown();

const { value: envVars, error } = envVarsSchema.validate(
  merge(baseConfig, envConfig)
);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default merge(baseConfig, envConfig);
