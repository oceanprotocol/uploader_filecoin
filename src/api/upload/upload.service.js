import { utils, providers, Contract, Wallet } from "ethers";
import axios from "axios";
import config from "../../config";
import { ethers } from "ethers";
import { ERC20, DepositABI } from "../../abi/mini";
import { getData, getLastKnowNonce, updateData } from "../../util/db";

export const getQuotaData = async (quoteId) => {
  let data;

  data = await getData(quoteId);
  if (!data) {
    throw new Error("invalid quoteID");
  }
  return data;
};

export const validateSignature = async (quoteId, nonce, address, signature) => {
  try {
    const sig = await utils.splitSignature(signature);

    const publicKeyToVerify = await utils
      .verifyMessage(`${quoteId}${nonce}`, sig)
      .toLowerCase();
    if (address === publicKeyToVerify) {
      return true;
    }
  } catch (e) {
    return false;
  }
};

export const validateNonce = async (address, nonce) => {
  return (await getLastKnowNonce(address)) < +nonce;
};

export const checkAllowance = async (
  tokenAddress,
  address,
  amount,
  chainId
) => {
  const provider = new ethers.providers.JsonRpcProvider(
    config.contractInfo[chainId].rpc
  );
  console.log(config.contractInfo[chainId].rpc);

  const contract = new Contract(tokenAddress, ERC20, provider);
  const data = await contract.allowance(
    address,
    config.contractInfo[chainId].contract
  );
  const balanceOf = await contract.balanceOf(address);
  return data >= amount && balanceOf >= amount;
};

export const buyStorage = async (user, tokenAddress, amount, chainId) => {
  const provider = new ethers.providers.JsonRpcProvider(
    config.contractInfo[chainId].rpc
  );

  try {
    const signer = new Wallet(config.privateKey, provider);
    const depositContract = new Contract(
      config.contractInfo[chainId].contract,
      DepositABI,
      signer,
      {
        gaslimit: 500000,
      }
    );
    await depositContract.ManagerAddDeposit(user, tokenAddress, amount);
    return true;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const migrateCIDS = async (user, files) => {
  return await axios({
    url: "https://api.lighthouse.storage/api/lighthouse/migration_request_ent",
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${config.bearer_token}`,
    },
    data: {
      data: JSON.stringify(files.map((elem) => elem.split("//")[1])),
      publicKey: user,
      enterprise: "ocean_protocol",
    },
  });
};

export const updateRow = async (nonce, quoteId, data) => {
  return await updateData({ quoteId, ...data, nonce, isUsed: true });
};
