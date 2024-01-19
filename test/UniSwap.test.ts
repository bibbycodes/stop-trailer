import {UniswapV3Swapper} from "../src/lib/swappers/uniswap";
import {erc20Abi} from "../src/abis/abis";
import {JsonRpcProvider, parseUnits, JsonRpcSigner} from "ethers";

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UniswapV3Swapper", function () {
  let uniswapV3Swapper;
  let signer: JsonRpcSigner;
  let provider: JsonRpcProvider;
  const uniswapRouterAddress = "0xeC8B0F7Ffe3ae75d7FfAb09429e3675bb63503e4";
  const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const WETHAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  let USDC
  let ONE_ETH
  let ONE_HUNDRED_USDC = ethers.parseUnits('100', 6)
  let WETH
  

  before(async function () {
    provider = ethers.provider
    const ethFoundationAddress = "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe"
    const ethFoundation = await ethers.getImpersonatedSigner(ethFoundationAddress);
    USDC =  new ethers.Contract(USDCAddress, erc20Abi, provider)
    WETH  = new ethers.Contract(WETHAddress, erc20Abi, provider)
    signer = await provider.getSigner();
    const tx = await USDC.connect(ethFoundation).transfer(signer.address, ONE_HUNDRED_USDC)
    await tx.wait()
    uniswapV3Swapper = new UniswapV3Swapper(provider, signer, uniswapRouterAddress);
  });

  it("Should receive USDC after swapping WETH", async function () {
    await USDC.connect(signer).approve(uniswapRouterAddress, ONE_HUNDRED_USDC)
    const amountIn = ONE_HUNDRED_USDC
    const amountOutMin = BigInt("0"); // Minimal amount of USDC to accept - Set this according to your slippage tolerance
    const fee = 1500;
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
    const initialWethBal = await WETH.balanceOf(signer.address);

    const result = await uniswapV3Swapper.swap(USDCAddress, WETHAddress, amountIn, amountOutMin, fee, signer.address, deadline);
    console.log({result})
    expect(result.status).to.equal(1);
    const finalUSDCBalance = await WETH.balanceOf(signer.address);
    expect(finalUSDCBalance).to.be.gt(initialWethBal);
  });
});
