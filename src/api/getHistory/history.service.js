import { getHistoryForAddress } from '../../util/db';

export const retriveHistory = async (userAddress) => {
  return getHistoryForAddress(userAddress) ?? null;
};