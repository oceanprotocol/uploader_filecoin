import { getHistoryForAddress } from '../../util/db';
import { utils } from 'ethers';

export const retriveHistory = async (userAddress) => {
  getHistoryForAddress(userAddress) ?? null;
};