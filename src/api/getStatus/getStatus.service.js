import axios from 'axios';

export const checkCID = async (requestId) =>
  axios({
    url: `https://api.lighthouse.storage/api/lighthouse/migration_request_info?requestId=${requestId}`,
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });

export const dealDetails = async (cid) =>
  (
    await axios({
      url: `https://api.lighthouse.storage/api/lighthouse/deal_status?cid=${cid}`,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
    })
  ).data;
