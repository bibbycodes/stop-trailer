export interface Asset {
  assetId: string;
  uniswapRouter: string;
  contractAddress: string;
  coingeckoId: string;
  swapToContractAddress: string;
}

export interface User {
  userId: string;
  walletAddress: string;
  assets: Asset[];
}

export interface SellOrder {
  assetId: string;
  triggerPrice: number;
  status: string;
}


export interface Data {
  users: User[];
  activeSellOrders: SellOrder[];
}
