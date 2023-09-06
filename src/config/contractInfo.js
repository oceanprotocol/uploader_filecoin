import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const { error: chainError, value: ChainList } = Joi.array().items(Joi.number()).min(1).validate(JSON.parse(process.env.CHAINS ?? "[]"), {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
});

if (chainError) {
  throw new Error(`env is missing some objects:[${chainError?.message}]`);
}
const config = ChainList.reduce((result, chainid) => {
  const data = (Object.entries(process.env).filter(([key, value]) => key.startsWith(chainid + "_CURRENCY_")))

  return {
    ...result,
    [chainid]: {
      currency: data.reduce((_result, _currency) => ({ ..._result, [_currency[0].split("_")[2]]: _currency[1] }), {}),
      rpc: process.env[`${chainid}_RPC`],
      contract: process.env[`${chainid}_CONTRACT`],
    },
  };
}, {})


export default config
