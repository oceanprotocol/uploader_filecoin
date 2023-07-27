import { retriveHistory } from './history.service';

const getHistory = async (req, res) => {
  const { userAddress } = req.body;
  const data = retriveHistory(userAddress);
  return res.status(200).json({
    data
  });
};

export default {
  getHistory
};
