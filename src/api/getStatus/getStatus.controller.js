import { checkAllowance, getQuotaData } from '../upload/upload.service';
import { checkCID, dealDetails } from './getStatus.service';

const getStatus = async (req, res) => {
  console.log('Entering getStatus function');

  const { quoteId } = req.query;

  console.log(`Received quoteId: ${quoteId}`);

  let data;

  try {
    console.log('Trying to fetch quota data');
    data = await getQuotaData(quoteId);
    console.log(`Fetched quota data successfully: ${JSON.stringify(data)}`);
  } catch (e) {
    console.log('Error fetching quota data', e);
    return res.status(200).json({ status: 0, error: e?.message });
  }

  if (!data.isUsed) {
    console.log('Data is not used');
    try {
      console.log('Checking for token allowance and balance');
      const isAllowed = await checkAllowance(
        data.tokenAddress,
        data.userAddress,
        data.tokenAmount,
        data.chainId
      );
      console.log(`Is token allowance and balance adequate?: ${isAllowed}`);

      if (!isAllowed) {
        // Inadequate Balance or token Allowance given
        return res.status(200).json({ status: 199 });
      }
    } catch (e) {
      console.log('Error checking token allowance', e);
    }
    // Waiting for files to be uploaded by the user
    return res.status(200).json({ status: 99 });
  }

  try {
    console.log('Trying to check CID status');
    const response = await checkCID(data.requestID);

    if (
      response?.data?.filter((e) => e?.cidStatus !== 'pinned')?.length === 0
    ) {
      const listCID = response?.data?.map((elem) => elem.cid);

      // filecoin deals are made in Batch, A request belongs to the same deal
      console.log('All CIDs are pinned');

      // randomly select one cid
      const randomCID = listCID[Math.floor(Math.random() * listCID.length)];
      console.log(`Selected random CID: ${randomCID}`);

      try {
        console.log('Trying to get deal details');
        const deals = await dealDetails(randomCID);
        console.log('Fetched deal details successfully');

        if (deals.length > 0) {
          // success fully Uploaded
          console.log('Deals length:', deals.length);
          return res.status(200).json({ status: 400 });
        }
      } catch (err) {
        console.log('Error fetching deal details', err);
        return res.status(200).json({ status: 399 });
      }
      return res.status(200).json({ status: 399 });
    }
    // some Cid are not Pinned
    console.log('some Cid are not Pinned');
    return res.status(200).json({ status: 300 });
  } catch (e) {
    console.log('Error in CID check block', e);
    return res.status(400).json({ error: e.message, status: 401 });
  }
};

const rejectRequest = (req, res) =>
  res.status(406).json({ message: 'Method Not allowed', data: {} });

export default {
  rejectRequest,
  getOne: getStatus,
  updateOne: rejectRequest,
};
