import {
  validateSignature,
  getQuotaData,
  validateNonce,
  checkAllowance,
  buyStorage,
  migrateCIDS,
  updateRow,
} from './upload.service';

const createUpload = async (req, res) => {
  const { quoteId, nonce, signature, files } = req.body;

  try {
    const data = await getQuotaData(quoteId);

    if (data.isUsed) {
      return res.status(400).json({ message: 'quoteID used', data: {} });
    }

    if (
      !(await validateSignature(quoteId, nonce, data.userAddress, signature))
    ) {
      return res.status(400).json({ message: 'Invalid signature', data: {} });
    }

    if (!(await validateNonce(data.userAddress, nonce))) {
      return res.status(400).json({ message: 'Invalid nonce', data: {} });
    }
    if (
      !(await checkAllowance(
        data.tokenAddress,
        data.userAddress,
        data.tokenAmount,
        data.chainId
      ))
    ) {
      return res.status(400).json({
        message: 'In-Adequate Token Approval or Balance',
        data: {},
      });
    }

    if (
      await buyStorage(
        data.userAddress,
        data.tokenAddress,
        data.tokenAmount,
        data.chainId
      )
    ) {
      const response = await migrateCIDS(data.userAddress, files);
      await updateRow(nonce, quoteId, response.data);
      return res.status(200).json({
        message: 'Success',
        data: { ...req.body, ...response.data },
      });
    }
    return res.status(500).json({
      message: 'an Error occurred when purchasing Storage',
      data: {},
    });
  } catch (e) {
    return res.status(400).json({ message: e.message, data: {} });
  }
};

const rejectRequest = (req, res) =>
  res.status(406).json({ message: 'Method Not allowed', data: {} });

export default {
  createOne: createUpload,
  rejectRequest,
  getOne: rejectRequest,
  updateOne: rejectRequest,
};
