"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swapServiceEthereum = void 0;
require("dotenv").config();
const IUniswapV3Factory_json_1 = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json");
const IUniswapV3Pool_json_1 = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const ISwapRouter_json_1 = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json");
const IERC20Metadata_json_1 = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/IERC20Metadata.sol/IERC20Metadata.json");
const IWETH_json_1 = require("@uniswap/swap-router-contracts/artifacts/contracts/interfaces/IWETH.sol/IWETH.json");
const IQuoter_json_1 = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/IQuoter.sol/IQuoter.json");
const ethers_1 = require("ethers");
const token_1 = require("../../helpers/token");
const responseBase_1 = require("../../responses/responseBase");
const varhelper_1 = require("../../helpers/varhelper");
const swapTokenResponse_1 = require("../../responses/swapTokenResponse");
//Deployment addressess
// Replace with actual Uniswap V3 pool factor address on Sepolia/Mainnet
const poolFactoryAddress = '0x0227628f3F023bb0B980b67D528571c95c6DaC1c';
const swapRouterAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564'; // main et sepolia
// Replace with actual Uniswap V3 quote address on Sepolia/Mainnet
const quoteContractAddress = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6';
class swapServiceEthereum {
    constructor() {
        //test net
        this.provider = new ethers_1.ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_PROJECT_ID}`);
        //main net
        //this.provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_PROJECT_ID}`);      
    }
    //Main method for swap 
    swapTokenEth(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            const wallet = new ethers_1.Wallet(request.walletKey, this.provider);
            //Get token details you want to swap from
            const tokenFrom = (0, token_1.getTokenBySymbol)(request.fromToken);
            //Get token details you want to swap to
            const tokenTo = (0, token_1.getTokenBySymbol)(request.toToken);
            //parse amount, covert to wei
            request.amount = ethers_1.ethers.parseUnits(request.amount.toString(), tokenFrom.decimals);
            //confirm if swap is from eth => any token so you can wrap before swapping
            try {
                if (tokenFrom.symbol === 'WETH') {
                    //Check if wrapped ether already exist
                    const balanceWeth = yield this.CheckTokenBalance(tokenFrom, wallet);
                    console.log(`Weth balance ${ethers_1.ethers.formatEther(balanceWeth)}`);
                    //Wrap if it does not          
                    if ((yield this.wrapEth(request.amount, wallet)).status === 1) {
                        if ((yield this.approveSwap(tokenFrom, request.amount, wallet)).status === 1) {
                            //execute swap                
                            const swapParams = {
                                tokenIn: tokenFrom.address,
                                tokenOut: tokenTo.address,
                                fee: 3000, // Fee tier: 0.3%
                                recipient: wallet.address,
                                deadline: Math.floor(new Date().getTime() / 1000 + 60 * 20),
                                amountIn: request.amount,
                                amountOutMinimum: 0,
                                sqrtPriceLimitX96: 0
                            };
                            const reciept = yield this.executeSwap(swapParams, wallet);
                            if (reciept.status !== 1) {
                                yield this.unwrapWeth(request.amount, wallet);
                                response = new responseBase_1.ResponseBase(varhelper_1.varhelper.HttpStatusCodes.InternalServerError, "Swap was unsuccessfull. Please try again", varhelper_1.varhelper.ResponseStatus.ERROR);
                            }
                            else {
                                const responseBody = new swapTokenResponse_1.swapTokenResponse(request.network, `${request.fromToken} => ${request.toToken}`, reciept.hash);
                                response = new responseBase_1.ResponseBase(varhelper_1.varhelper.HttpStatusCodes.OK, "Swap was successfull", varhelper_1.varhelper.ResponseStatus.SUCCESS, responseBody);
                            }
                        }
                        else {
                            //unwrap weth if swap is not successful
                            yield this.unwrapWeth(request.amount, wallet);
                            response = new responseBase_1.ResponseBase(varhelper_1.varhelper.HttpStatusCodes.InternalServerError, "Swap was unsuccessfull. Please try again", varhelper_1.varhelper.ResponseStatus.ERROR);
                        }
                    }
                    else {
                        response = new responseBase_1.ResponseBase(varhelper_1.varhelper.HttpStatusCodes.InternalServerError, "Swap was unsuccessfull. Please try again", varhelper_1.varhelper.ResponseStatus.ERROR);
                    }
                    return response;
                }
                else {
                    if ((yield this.approveSwap(tokenFrom, request.amount, wallet)).status === 1) {
                        //execute swap                
                        const swapParams = {
                            tokenIn: tokenFrom.address,
                            tokenOut: tokenTo.address,
                            fee: 3000,
                            recipient: wallet.address,
                            deadline: Math.floor(new Date().getTime() / 1000 + 60 * 20),
                            amountIn: request.amount,
                            amountOutMinimum: 0,
                            sqrtPriceLimitX96: 0
                        };
                        const reciept = yield this.executeSwap(swapParams, wallet);
                        if (reciept.status === 1) {
                            if (tokenTo.symbol === ("WETH")) {
                                // Retrieve the amount of WETH received from the swap
                                const formatEth = ethers_1.ethers.parseEther(request.amount.toString());
                                // const amountWeth = ethers.parseUnits(formatEth.toString(), tokenTo.decimals)
                                yield this.unwrapWeth(null, wallet);
                            }
                            const responseBody = new swapTokenResponse_1.swapTokenResponse(request.network, `${request.fromToken} => ${request.toToken}`, reciept.hash);
                            response = new responseBase_1.ResponseBase(varhelper_1.varhelper.HttpStatusCodes.OK, "Swap was successfull", varhelper_1.varhelper.ResponseStatus.SUCCESS, responseBody);
                        }
                    }
                    else {
                        response = new responseBase_1.ResponseBase(varhelper_1.varhelper.HttpStatusCodes.InternalServerError, "Swap was unsuccessfull. Please try again", varhelper_1.varhelper.ResponseStatus.ERROR);
                    }
                    return response;
                }
            }
            catch (error) {
                //return error;
                return new responseBase_1.ResponseBase(varhelper_1.varhelper.HttpStatusCodes.InternalServerError, `Swap was unsuccessfull. ${error.error.message}`, varhelper_1.varhelper.ResponseStatus.ERROR, error);
            }
        });
    }
    estimateSwapEth(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //Get token details you want to swap from
                const tokenFrom = (0, token_1.getTokenBySymbol)(request.fromToken);
                //Get token details you want to swap to
                const tokenTo = (0, token_1.getTokenBySymbol)(request.toToken);
                //parse amount, covert to wei
                request.amount = ethers_1.ethers.parseUnits(request.amount.toString(), tokenFrom.decimals);
                const wallet = new ethers_1.Wallet(request.walletKey, this.provider);
                const amountOut = yield this.quoteSwap(3000, request.amount, tokenFrom, tokenTo);
                return amountOut;
            }
            catch (error) {
                return error;
            }
        });
    }
    //check token balance
    CheckTokenBalance(token, wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenContract = new ethers_1.Contract(token.address, IERC20Metadata_json_1.abi, wallet);
            const balance = tokenContract.balanceOf(wallet.address);
            // if(token.symbol === "WETH"){
            //     const wethContract = new Contract(token.address, IWETHABI, wallet); 
            //     balance = await this.provider.getBalance(wallet.address);
            // }else{
            //     const tokenContract = new Contract(token.address, IERC20, this.provider); 
            //     balance = await tokenContract.balanceOf(wallet.address);
            // }
            return balance;
        });
    }
    //wrap eth
    wrapEth(amountIn, wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            const WETH = (0, token_1.getTokenBySymbol)("WETH");
            const wethContract = new ethers_1.Contract(WETH.address, IWETH_json_1.abi, wallet);
            //wrap eth to weth
            const wrapTxReq = yield wethContract.deposit({ value: amountIn });
            const wrapTx = yield wrapTxReq.wait();
            return wrapTx;
            // Define the transaction details
            // const tx = {
            //     to: WETH.address,
            //     data: wethContract.interface.encodeFunctionData('deposit')
            // };
            // Check if there are enough funds to cover the transaction value and estimated gas fees
            // const gasEstimate = await this.provider.estimateGas(tx);
            // const gasPrice = (await this.provider.getFeeData()).gasPrice;
            // if (!gasPrice) {
            //     throw new Error('Failed to fetch gas price');
            // }
            // const totalGasCost = gasEstimate * gasPrice;
            // const totalGasCostEth = ethers.formatEther(totalGasCost);
            // const totalCost = amountIn + totalGasCost;
            // console.log(`totalGasCost: ${totalGasCost} wei`);
            // console.log(`totalGasCost: ${totalGasCostEth} ETH`);
            // console.log(`totalCost: ${totalCost} wei`);
            // console.log(`totalCost: ${ethers.formatEther(totalCost)} ETH`);
            // if (balance  < totalCost) {
            //     throw new Error('Insufficient funds to cover the transaction and gas fees');
            // }
        });
    }
    //unwrap eth
    unwrapWeth(amountIn, wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            const WETH = (0, token_1.getTokenBySymbol)("WETH");
            // If amountIn is null or 0, fetch the WETH balance from the wallet
            if (amountIn === null) {
                amountIn = yield this.CheckTokenBalance(WETH, wallet);
                //amountIn = ethers.parseEther(amount.toString())
                console.log(`WETH Bal: ${amountIn}`);
            }
            // If amountIn is still 0 after fetching balance, exit the function
            if (amountIn === BigInt(0)) {
                return;
            }
            const wethContract = new ethers_1.Contract(WETH.address, IWETH_json_1.abi, wallet);
            const unwrapTxReq = yield wethContract.withdraw(amountIn, {
                gasLimit: 100000
            });
            const unwrapTx = yield unwrapTxReq.wait();
            return unwrapTx;
        });
    }
    //Approve uniswap to access wallet address
    approveSwap(tokenAddress, amount, wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenContract = new ethers_1.ethers.Contract(tokenAddress.address, IERC20Metadata_json_1.abi, wallet);
            const approveTransactionReq = yield tokenContract.approve(swapRouterAddress, amount);
            const approveReceipt = yield approveTransactionReq.wait();
            //console.log(approveReceipt);
            return approveReceipt;
        });
    }
    //Swap token
    executeSwap(params, wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            const swapRouter = new ethers_1.Contract(swapRouterAddress, ISwapRouter_json_1.abi, wallet);
            const transaction = yield swapRouter.exactInputSingle(params);
            const reciept = yield transaction.wait();
            console.log(`swap receipt ${reciept}`);
            return reciept;
        });
    }
    //Get Pool Details
    getPoolData(tokenInSymbol, tokenOutSymbol) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenIn = (0, token_1.getTokenBySymbol)(tokenInSymbol);
            const tokenOut = (0, token_1.getTokenBySymbol)(tokenOutSymbol);
            const poolFactoryContract = new ethers_1.Contract(poolFactoryAddress, IUniswapV3Factory_json_1.abi, this.provider);
            const poolAddress = yield poolFactoryContract.getPool(tokenIn.address, tokenOut.address, 3000);
            console.log(poolAddress);
            if (!poolAddress) {
                throw new Error("Failed to get pool address");
            }
            const poolContract = new ethers_1.Contract(poolAddress, IUniswapV3Pool_json_1.abi, this.provider);
            console.log(poolContract);
            const [token0, token1, fee, slot] = yield Promise.all([
                poolContract.token0(),
                poolContract.token1(),
                poolContract.fee(),
                poolContract.slot0()
            ]);
            console.log(token0, token1, fee, slot[0]);
            return { poolContract, token0, token1, fee, slot };
        });
    }
    //Quote Swap Transaction
    quoteSwap(fee, amountIn, tokenFrom, tokenTo) {
        return __awaiter(this, void 0, void 0, function* () {
            const quoteContract = new ethers_1.Contract(quoteContractAddress, IQuoter_json_1.abi, this.provider);
            const quote = yield quoteContract.quoteExactInputSingle.staticCall(tokenFrom.address, tokenTo.address, 3000, 
            // recipient: wallet.address,
            // deadline: Math.floor(new Date().getTime() / 1000 + 60 * 10),
            amountIn, 0);
            const quotedAmount = ethers_1.ethers.formatUnits(quote[0], tokenTo.decimals);
            return quotedAmount;
        });
    }
}
exports.swapServiceEthereum = swapServiceEthereum;
//# sourceMappingURL=swapServiceEthereum.js.map