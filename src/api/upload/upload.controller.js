import {
  validateSignature,
  getQuotaData,
  validateNonce,
  checkAllowance,
  buyStorage,
  migrateCIDS,
  updateRow,
} from './upload.service';

const sendResponse = (res, statusCode, message, data = {}) => {
  console.log(
    `Sending response with status: ${statusCode}, message: ${message}`
  );
  return res.status(statusCode).json({ message, data });
};

const createUpload = async (req, res) => {
  console.log('Received createUpload request with body:', req.body);

  const { quoteId, nonce, signature, files } = req.body;

  try {
    const data = await getQuotaData(quoteId);

    if (data.isUsed) {
      return sendResponse(res, 400, 'quoteID used');
    }

    if (
      !(await validateSignature(quoteId, nonce, data.userAddress, signature))
    ) {
      return sendResponse(res, 400, 'Invalid signature');
    }

    if (!(await validateNonce(data.userAddress, nonce))) {
      return sendResponse(res, 400, 'Invalid nonce');
    }

    if (
      !(await checkAllowance(
        data.tokenAddress,
        data.userAddress,
        data.tokenAmount,
        data.chainId
      ))
    ) {
      return sendResponse(res, 400, 'In-Adequate Token Approval or Balance');
    }

    const boughtStorage = await buyStorage(
      data.userAddress,
      data.tokenAddress,
      data.tokenAmount,
      data.chainId
    );
    if (!boughtStorage) {
      return sendResponse(
        res,
        500,
        'an Error occurred when purchasing Storage'
      );
    }

    const response = await migrateCIDS(data.userAddress, files);
    await updateRow(nonce, quoteId, response.data);

    return sendResponse(res, 200, 'Success', { ...req.body, ...response.data });
  } catch (e) {
    console.error('Error during createUpload process:', e);
    return sendResponse(res, 400, e.message);
  }
};

const rejectRequest = (req, res) =>
  sendResponse(res, 406, 'Method Not allowed');

export default {
  createOne: createUpload,
  rejectRequest,
  getOne: rejectRequest,
  updateOne: rejectRequest,
};
