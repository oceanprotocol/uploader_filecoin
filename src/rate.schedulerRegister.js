import cron from 'node-cron';
import axios from 'axios';
import config from './config';

const job = async () => {
  const data = await axios({
    url: config.dbsUrl,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: {
      type: 'filecoin',
      description: 'File storage on FileCoin',
      url: config.locationUrl,
      payment: Object.entries(config.contractInfo).map(([key, value]) => ({
        chainId: key,
        acceptedTokens: value.currency,
      })),
    },
  })
    .then((res) => res.data)
    .catch((err) => err.response.status);
  return data;
};
const task = cron.schedule(`*/${config.dbsPingInMinutes} * * * *`, job, {
  runOnInit: true,
});

const start = () => {
  task.start();
};
const stopped = () => {
  task.stop();
};

export default {
  start,
  stopped,
};
