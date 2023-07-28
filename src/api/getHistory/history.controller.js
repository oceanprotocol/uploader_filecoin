import { retriveHistory } from './history.service';

const getHistory = async (req, res) => {
  const { userAddress } = req.body;
  const data = retriveHistory(userAddress);
  return res.status(200).json({
    data
  });
};

const rejectRequest = (req, res) =>
  res.status(405).json({ message: 'Method Not allowed', data: {} });

export default {
  getAll: getHistory,
  rejectRequest
};
