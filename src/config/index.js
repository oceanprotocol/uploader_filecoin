import dotenv from "dotenv";
import Joi from "joi";
import contractInfo from "./contractInfo";

dotenv.config();
const env = process.env.NODE_ENV || "development";

const baseConfig = {
  env,
  isDev: env === "development",
  isTest: env === "testing",
  port: process.env.PORT ?? 3000,
  privateKey: process.env.PRIVATE_KEY,
  dbsUrl: process.env.DBS_URL,
  locationUrl: process.env.LOCATION_URL,
  contractInfo,
  bearer_token: process.env.TOKEN,
  database_sql: process.env.DATABASE_SQL,
  user_sql: process.env.USER_SQL,
  password_sql: process.env.PASSWORD_SQL,
  dataname_sql: process.env.DATANAME_SQL,
  host_sql: process.env.HOST_SQL,
};

const envVarsSchema = Joi.object({
  contractInfo: Joi.object().required(),
  port: Joi.number().required("PORT is missing"),
  user_sql: Joi.string()
    .required()
    .messages({ "any.required": "USER_SQL is missing" }),
  password_sql: Joi.string(),
  dataname_sql: Joi.string()
    .required()
    .messages({ "any.required": "DATANAME_SQL is missing" }),
  database_sql: Joi.string()
    .required()
    .messages({ "any.required": "DATABASE_SQL is missing" }),
  host_sql: Joi.string()
    .required()
    .messages({ "any.required": "HOST_SQL is missing" }),
}).unknown();

const { error, value } = envVarsSchema.validate(baseConfig, {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
});

if (error) {
  throw new Error(`env is missing some objects:[${error?.message}]`);
}

export default value;
