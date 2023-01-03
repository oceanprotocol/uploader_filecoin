import config from "../../config";
import { ethers } from "ethers";
import { DepositABI } from "../../abi/mini";
import db, { putData } from "../../util/db";
import { v4 as uuid } from "uuid";

export const getStorageCost = async (tokenAddress, chainId, size) => {
  const provider = new ethers.providers.JsonRpcProvider(
    config.contractInfo[chainId].rpc
  );

  const contract = new ethers.Contract(
    config.contractInfo[chainId].contract,
    DepositABI,
    provider
  );
  return await contract.getStorageCostForStableCoins(tokenAddress, size);
};

export const saveQuote = async (data) => {
  const num = uuid().replaceAll("-", "");
  await putData({ quoteId: num, ...data });
  return num;
};
