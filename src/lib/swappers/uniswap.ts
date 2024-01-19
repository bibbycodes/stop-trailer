import { ethers, BigNumber } from 'ethers';
import {uniV3RouterAbi, erc20Abi} from "../../abis/abis";
export class UniswapV3Swapper {
  private provider: ethers.providers.JsonRpcProvider;
  private signer: ethers.Signer;
  private router: ethers.Contract;
  private uniswapRouterAddress: string;

  constructor(provider: ethers.providers.JsonRpcProvider, signer: ethers.Signer, uniswapRouterAddress: string) {
    this.provider = provider
    this.signer = signer;
    this.uniswapRouterAddress = uniswapRouterAddress;
    this.router = new ethers.Contract(
      uniswapRouterAddress,
      uniV3RouterAbi,
      this.signer
    );
  }

  async swap(tokenIn: string, tokenOut: string, amountIn: BigNumber, amountOutMin: BigNumber, fee: number, recipient: string, deadline: number): Promise<string> {
    const tokenContract = new ethers.Contract(tokenIn, erc20Abi, this.signer);
    await tokenContract.approve(this.uniswapRouterAddress, amountIn);

    const params = {
      tokenIn: tokenIn,
      tokenOut: tokenOut,
      fee: fee,
      recipient: recipient,
      deadline: deadline,
      amountIn: amountIn,
      amountOutMinimum: amountOutMin,
      sqrtPriceLimitX96: 0,
    };

    const tx = await this.router.exactInputSingle(params);
    const receipt = await tx.wait();
    return receipt.transactionHash;
  }
}


