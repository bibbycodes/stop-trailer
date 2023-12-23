import express from 'express';
import cron from 'node-cron';
import {getPrices} from "./lib/get-prices";
import {readData, writeData} from "./lib/db";


const app = express();
const PORT = 3000;
const DATA_FILE_PATH = 'data.json';

cron.schedule('*/30 * * * * *', () => {
  console.log('Running a task every 30 seconds');
  getPrices();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post('/orders', (req, res) => {
  const { price, assetId, walletAddress} = req.body;

  const data = readData(DATA_FILE_PATH);

  const user = data.users.find(u => u.walletAddress === walletAddress);
  if (!user) {
    return res.status(404).send('User not found');
  }

  const asset = user.assets.find(a => a.assetId === assetId);
  if (!asset) {
    return res.status(404).send('Asset not found');
  }

  // Create or update the stop order
  const existingOrderIndex = data.activeSellOrders.findIndex(order => order.assetId === assetId);
  if (existingOrderIndex > -1) {
    data.activeSellOrders[existingOrderIndex] = { assetId, triggerPrice: price, status: 'active' };
  } else {
    data.activeSellOrders.push({ assetId, triggerPrice: price, status: 'active' });
  }

  writeData(data, DATA_FILE_PATH);

  console.log(`User ${walletAddress} added stop loss on asset ${assetId} at price ${price}`);
  res.send(`Stop order for asset ${assetId} of user ${walletAddress} set at price ${price}`);
});
