import { getHistoryForAddress } from '../../util/db';
import { utils } from 'ethers';


export const retriveHistory = async (userAddress) => {
  getHistoryForAddress(userAddress) ?? null;
};

export const validateSignature = async (nonce, address, signature) => {
  try {
    const sig = await utils.splitSignature(signature);

    const publicKeyToVerify = await utils
      .verifyMessage(`${address}${nonce}`, sig)
      .toLowerCase();
    if (address === publicKeyToVerify) {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
};