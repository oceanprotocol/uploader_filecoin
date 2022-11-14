import config from "../../config";
import { ethers } from "ethers";
import { DepositABI } from "../../abi/mini";
import db, { putData } from "../../util/db";
import { v4 as uuid } from "uuid";

const mumbaiProvider = new ethers.providers.JsonRpcProvider(
  "https://polygon-mumbai.g.alchemy.com/v2/NvgEIkT9nJ900ieCAKHe4HKBT-ChYqgB"
);

const mumbaiDepositContract = new ethers.Contract(
  config.depositMumbai,
  DepositABI,
  mumbaiProvider
);

export const getStorageCost = async (tokenAddress, size) => {
  return await mumbaiDepositContract.getStorageCostForStableCoins(
    tokenAddress,
    size
  );
};

export const saveQuote = async (data) => {
  const num = uuid().replaceAll("-", "");
  await putData({ quoteId: num, ...data });
  return num;
};
