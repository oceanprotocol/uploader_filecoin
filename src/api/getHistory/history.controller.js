import { retriveHistory } from './history.service';
import { validateSignature, validateNonce } from '../upload/upload.service';

const getHistory = async (req, res) => {
  const { userAddress, nonce, signature, page = 1, pageSize = 25 } = req.query;

  try {
    const quoteId = '';
    const userAddressLowerCase = userAddress.toLowerCase();
    if (
      !(await validateSignature(
        quoteId,
        nonce,
        userAddressLowerCase,
        signature
      ))
    ) {
      return res.status(400).json({ message: 'Invalid signature', data: {} });
    }

    if (!(await validateNonce(userAddressLowerCase, nonce))) {
      return res.status(400).json({ message: 'Invalid nonce', data: {} });
    }

    const data = await retriveHistory(userAddressLowerCase, page, pageSize);
    return res.status(200).json({
      data,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message, data: {} });
  }
};

const rejectRequest = (req, res) =>
  res.status(405).json({ message: 'Method Not allowed', data: {} });

export default {
  getAll: getHistory,
  rejectRequest,
};
