import cron from "node-cron";
import axios from "axios";
import config from "./config";

const task = cron.schedule(
  "*/10 * * * *",
  async () => {
    await axios({
      url: config.dbsUrl,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: {
        type: "filecoin",
        description: "File storage on FileCoin",
        url: config.locationUrl,
        payment: Object.keys(config.paymentAddress).map((key) => {
          return { chainId: key, acceptedTokens: config.paymentAddress[key].currency };
        }),
      },
    });
  },
  {
    scheduled: false,
  }
);

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
