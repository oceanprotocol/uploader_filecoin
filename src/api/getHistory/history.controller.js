import { retriveHistory } from './history.service';
import { validateSignature, validateNonce } from '../upload/upload.service';

const getHistory = async (req, res) => {
  const { userAddress, nonce, signature } = req.query;

  try {
    const quoteId = '';
    if (!(await validateSignature(quoteId, nonce, userAddress, signature))) {
      return res.status(400).json({ message: 'Invalid signature', data: {} });
    }

    if (!(await validateNonce(userAddress, nonce))) {
      return res.status(400).json({ message: 'Invalid nonce', data: {} });
    }

    const data = retriveHistory(userAddress);
    return res.status(200).json({
      data,
    });
  } catch (e) {
    return res.status(400).json({ message: e.message, data: {} });
  }
};

const rejectRequest = (req, res) =>
  res.status(405).json({ message: 'Method Not allowed', data: {} });

export default {
  getAll: getHistory,
  rejectRequest,
};
