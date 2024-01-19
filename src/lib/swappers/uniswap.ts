import {ethers, JsonRpcProvider} from 'ethers';
import {uniV3RouterAbi, erc20Abi} from "../../abis/abis";

export class UniswapV3Swapper {
  private readonly signer: ethers.Signer;
  private router: ethers.Contract;
  private readonly uniswapRouterAddress: string;

  constructor(provider: JsonRpcProvider, signer: ethers.Signer, uniswapRouterAddress: string) {
    this.signer = signer;
    this.uniswapRouterAddress = uniswapRouterAddress;
    this.router = new ethers.Contract(
      uniswapRouterAddress,
      uniV3RouterAbi,
      this.signer
    );
  }

  // Assuming tokens have already been approved
  async swap(tokenIn: string, tokenOut: string, amountIn: BigInt, amountOutMin: BigInt, fee: number, recipient: string, deadline: number): Promise<string> {
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

    if (!tx) {
      throw "No tx"
    }
    
    const receipt = await tx.wait();
    
    if (!receipt) {
      throw "No receipt"
    }
    
    return receipt;
  }
  
  getRouterContract = () => {
    return this.router
  }
}
