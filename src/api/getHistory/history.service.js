import { getHistoryForAddress } from '../../util/db';

export const retrieveHistory = async (userAddress, page, pageSize) =>
  getHistoryForAddress(userAddress, page, pageSize) ?? null;
