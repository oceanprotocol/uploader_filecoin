import Joi from 'joi';
import contractInfo from './contractInfo';

const env = process.env.NODE_ENV || 'development';

const baseConfig = {
  env,
  isDev: env === 'development',
  isTest: env === 'testing',
  port: process.env.FILECOIN_DBS_PORT ?? 3000,
  dbsPingInMinutes: process.env.DBS_PING_IN_MINUTES ?? '1',
  privateKey: process.env.PRIVATE_KEY,
  dbsUrl: process.env.DBS_URL,
  locationUrl: process.env.LOCATION_URL,
  contractInfo,
  bearer_token: process.env.LIGHTHOUSE_API_TOKEN,
  database_sql: process.env.DATABASE_SQL,
  user_sql: process.env.USER_SQL,
  password_sql: process.env.PASSWORD_SQL,
  dataname_sql: process.env.TABLENAME_SQL,
  host_sql: process.env.HOST_SQL,
  db_type: process.env.DB_TYPE,
  db_storage: process.env.DB_STORAGE,
};
const currencySchema = Joi.object().pattern(Joi.string(), Joi.string().required());

const contractInfoSchema = Joi.object().keys({
  currency: currencySchema,
  rpc: Joi.string()
    .uri({ scheme: ['https'] })
    .required(),
  contract: Joi.string().required(),
});

const envVarsSchema = Joi.object({
  contractInfo: Joi.object().pattern(Joi.number(), contractInfoSchema).required(),
  port: Joi.number().required('PORT is missing'),
  dbsPingInMinutes: Joi.number().required('dbsTimeout is missing'),
  db_type: Joi.string().insensitive().valid('mysql', 'sqlite').required(),
  user_sql: Joi.when('db_type', {
    is: Joi.equal('mysql'),
    then: Joi.string().required().messages({
      'any.required': 'USER_SQL is required for DB_TYPE=`mysql`',
    }),
    otherwise: Joi.string(),
  }),
  password_sql: Joi.string(),
  dataname_sql: Joi.when('db_type', {
    is: Joi.equal('mysql'),
    then: Joi.string().required().messages({
      'any.required': 'TABLENAME_SQL is required for DB_TYPE=`mysql`',
    }),
    otherwise: Joi.string(),
  }),
  database_sql: Joi.when('db_type', {
    is: Joi.equal('mysql'),
    then: Joi.string().required().messages({
      'any.required': 'DATABASE_SQL is required for DB_TYPE=`mysql`',
    }),
    otherwise: Joi.string(),
  }),
  host_sql: Joi.when('db_type', {
    is: Joi.equal('mysql'),
    then: Joi.string().required().messages({
      'any.required': 'HOST_SQL is required for DB_TYPE=`mysql`',
    }),
    otherwise: Joi.string(),
  }),
  db_storage: Joi.when('db_type', {
    is: Joi.equal('c'),
    then: Joi.string().required().messages({
      'any.required': 'db_storage is required for DB_TYPE=`sqlite`',
    }),
    otherwise: Joi.string(),
  }),
}).unknown();

const { error, value } = envVarsSchema.validate(baseConfig, {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
});

if (error) {
  console.log(`env is missing some objects:[${error?.message}]`);
  throw new Error(`env is missing some objects:[${error?.message}]`);
}

export default value;
