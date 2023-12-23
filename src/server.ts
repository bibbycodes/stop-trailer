import express from 'express';
import cron from 'node-cron';
import {getPrices} from "./lib/get-prices";

const app = express();
const PORT = 3000;

cron.schedule('*/30 * * * * *', () => {
  console.log('Running a task every 30 seconds');
  getPrices();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
