import { retrieveHistory } from './history.service';
import { validateSignature, validateNonce } from '../upload/upload.service';

const getHistory = async (req, res) => {
  console.log('getHistory');
  const { userAddress, nonce, signature, page = 1, pageSize = 25 } = req.query;
  console.log('Address:', userAddress);
  console.log('Nonce:', nonce);
  console.log('Signature:', signature);
  console.log('Page:', page);
  console.log('PageSize:', pageSize);

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

    const history = await retrieveHistory(
      userAddressLowerCase,
      Number(page),
      Number(pageSize)
    );
    res.send(history);
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
