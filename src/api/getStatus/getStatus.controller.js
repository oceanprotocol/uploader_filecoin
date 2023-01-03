import { checkAllowance, getQuotaData } from "../upload/upload.service";
import { checkCID } from "./getStatus.service";

const getStatus = async (req, res) => {
  const { quoteId } = req.query;
  let data;
  try {
    data = await getQuotaData(quoteId);
  } catch (e) {
    console.log(e);
    // Invalid Quote Id or Id not found
    return res.status(200).json({ status: 0 });
  }

  if (!data.isUsed) {
    if (
      !(await checkAllowance(
        data.tokenAddress,
        data.userAddress,
        data.tokenAmount,
        data.chainId
      ))
    ) {
      // Inadequate Balance or token Allowance given
      return res.status(200).json({ status: 199 });
    }
    // Waiting for files to be uploaded by the user
    return res.status(200).json({ status: 99 });
  }
  //
  try {
    const response = await checkCID(data.requestID);
    if (response?.data?.filter((e) => e?.cidStatus !== "pinned")?.length == 0) {
      // success fully Uploaded
      return res.status(200).json({ status: 400 });
    } else {
      // some Cid are not Pinned
      return res.status(200).json({ status: 300 });
    }
  } catch (e) {
    // something went wrong
    return res.status(400).json({ error: e.message, status: 401 });
  }
};

const rejectRequest = (req, res) => {
  return res.status(406).json({ message: "Method Not allowed", data: {} });
};

export default {
  rejectRequest,
  getOne: getStatus,
  updateOne: rejectRequest,
};
