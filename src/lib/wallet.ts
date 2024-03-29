import {ethers, JsonRpcProvider} from "ethers";

export class Wallet {
  private readonly signer: ethers.Signer;
  private static instance: Wallet;

  constructor(private readonly privateKey: string, private provider: JsonRpcProvider) {
    this.signer = this.getSigner()
    this.privateKey = privateKey
  }

  public static getInstance(privateKey: string, provider: JsonRpcProvider): Wallet {
    if (!Wallet.instance) {
      Wallet.instance = new Wallet(privateKey, provider);
    }
    return Wallet.instance;
  }

  getSigner() {
    if (!this.signer) {
      return new ethers.Wallet(this.privateKey, this.provider)
    }
    return this.signer
  }
}
