import config from '../../config';
import { getStorageCost, saveQuote } from './quote.service';

const createQuota = async (req, res) => {
  const { files, payment, userAddress } = req.body;
  let cost;

  const getTotalFileSize = files.reduce((result, elem) => result + elem.length, 0);

  try {
    cost = await getStorageCost(payment.tokenAddress, payment.chainId, getTotalFileSize);
  } catch (e) {
    return res.status(400).json({ message: 'Error', data: e?.reason });
  }

  const _data = {
    tokenAmount: parseInt(cost, 10),
    approveAddress: config.contractInfo[payment.chainId].contract,
    chainId: payment.chainId,
    tokenAddress: payment.tokenAddress,
  };
  const quoteId = await saveQuote({ ..._data, userAddress, isUsed: false });

  return res.status(200).json({
    ..._data,
    quoteId,
  });
};

const rejectRequest = (req, res) =>
  res.status(400).json({ message: 'Method Not allowed', data: {} });

export default {
  createOne: createQuota,
  rejectRequest,
  getOne: rejectRequest,
  updateOne: rejectRequest,
};
