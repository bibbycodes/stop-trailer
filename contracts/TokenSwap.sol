pragma solidity ^0.8.0;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenSwap is Ownable {
    ISwapRouter public immutable uniswapRouter;
    mapping(address => mapping(address => mapping(address => bool))) public userRoutes;

    constructor(ISwapRouter _uniswapRouter) {
        uniswapRouter = _uniswapRouter;
    }

    // Allow user to set a swap route
    function setUserRoute(address tokenIn, address tokenOut, bool allowed) public {
        userRoutes[msg.sender][tokenIn][tokenOut] = allowed;
    }

    // Perform a swap
    function swap(
        address userWallet,
        address tokenIn,
        address tokenOut,
        uint24 fee,  // Fee tier, e.g., 3000 for 0.3%
        uint amountIn,
        uint amountOutMinimum
    ) external onlyOwner {
        require(userRoutes[userWallet][tokenIn][tokenOut], "Swap route not allowed");

        IERC20(tokenIn).transferFrom(userWallet, address(this), amountIn);
        IERC20(tokenIn).approve(address(uniswapRouter), amountIn);

        ISwapRouter.ExactInputSingleParams memory params =
                            ISwapRouter.ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: fee,
                recipient: userWallet,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: amountOutMinimum,
                sqrtPriceLimitX96: 0
            });

        uniswapRouter.exactInputSingle(params);
    }

    // Emergency withdrawal function
    function emergencyWithdraw(address tokenAddress) external onlyOwner {
        IERC20 token = IERC20(tokenAddress);
        uint256 tokenBalance = token.balanceOf(address(this));
        require(tokenBalance > 0, "No tokens to withdraw");
        token.transfer(owner(), tokenBalance);
    }
}
