import { getHistoryForAddress } from '../../util/db';

export const retriveHistory = async (userAddress, page, pageSize) =>
  getHistoryForAddress(userAddress, page, pageSize) ?? null;
