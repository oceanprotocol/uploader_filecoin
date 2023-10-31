import axios from 'axios';

export const checkCID = async (requestId) => {
  try {
    console.log(
      `[checkCID] Initiating request to check CID for requestId: ${requestId}`
    );

    const response = await axios({
      url: `https://api.lighthouse.storage/api/lighthouse/migration_request_info?requestId=${requestId}`,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
    });

    console.log(
      `[checkCID] Successful API response: ${JSON.stringify(response.data)}`
    );

    return response;
  } catch (error) {
    console.error(`[checkCID] Error: ${error.message}`);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`[checkCID] Data: ${JSON.stringify(error.response.data)}`);
      console.error(`[checkCID] Status: ${error.response.status}`);
      console.error(
        `[checkCID] Headers: ${JSON.stringify(error.response.headers)}`
      );
    } else if (error.request) {
      // The request was made but no response was received
      console.error(
        `[checkCID] No response received: ${JSON.stringify(error.request)}`
      );
    }
    throw error;
  }
};

export const dealDetails = async (cid) => {
  try {
    console.log(
      `[dealDetails] Initiating request to check deal details for CID: ${cid}`
    );

    const response = await axios({
      url: `https://api.lighthouse.storage/api/lighthouse/deal_status?cid=${cid}`,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
    });

    console.log(
      `[dealDetails] Successful API response: ${JSON.stringify(response.data)}`
    );

    return response.data;
  } catch (error) {
    console.error(`[dealDetails] Error: ${error.message}`);
    if (error.response) {
      console.error(
        `[dealDetails] Data: ${JSON.stringify(error.response.data)}`
      );
      console.error(`[dealDetails] Status: ${error.response.status}`);
      console.error(
        `[dealDetails] Headers: ${JSON.stringify(error.response.headers)}`
      );
    } else if (error.request) {
      console.error(
        `[dealDetails] No response received: ${JSON.stringify(error.request)}`
      );
    }
    throw error;
  }
};
