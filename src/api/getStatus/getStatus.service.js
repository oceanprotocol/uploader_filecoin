import { utils, providers, Contract, Wallet } from "ethers";
import axios from "axios";
import config from "../../config";
import db from "../../util/db";
import { ERC20, DepositABI } from "../../abi/mini";

export const checkCID = async (requestId) => {
  return await axios({
    url: `https://api.lighthouse.storage/api/lighthouse/migration_request_info?requestId=${requestId}`,
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
};
