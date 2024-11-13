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
exports.swapServiceTron = void 0;
require("dotenv").config();
const TronWeb = require('tronweb');
const TRC20ABI = require('../../../abis/tron/trc20ABI.json');
const sunswapABI = require('../../../abis/tron/sunswapRouterABI.json');
const token_1 = require("../../helpers/token");
// SunSwap router contract address
const sunswapRouterAddress = 'TFVisXFaijZfeyeSjCEVkHfex7HGdTxzF9';
class swapServiceTron {
    constructor() {
        this.tronWeb = new TronWeb({
            fullHost: 'https://api.shasta.trongrid.io',
            headers: { "TRON-PRO-API-KEY": process.env.TRON_API_KEY },
        });
    }
    setPrivateKey(userPrivateKey) {
        this.tronWeb.setPrivateKey(userPrivateKey);
    }
    swapTokenTron(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //pass in private key of user to sign transactions using tronweb
                this.setPrivateKey(request.walletKey);
                //console.log(this.tronWeb.privateKey);
                //Get token details you want to swap from
                const tokenFrom = (0, token_1.getTokenBySymbolTron)(request.fromToken.toUpperCase());
                //Get token details you want to swap to
                const tokenTo = (0, token_1.getTokenBySymbolTron)(request.toToken);
                const deadline = Math.floor(new Date().getTime() / 1000 + 60 * 10);
                // get address from privatekey
                const address = this.tronWeb.address.fromPrivateKey(request.walletKey);
                console.log(address);
                if (tokenFrom.symbol === "TRX") {
                    let amountInSun = this.tronWeb.toSun(request.amount);
                    const path = [address, tokenTo.address];
                    const data = {
                        amountIn: amountInSun,
                        amountOutMin: 0,
                        to: address,
                        deadline: deadline
                    };
                    const response = yield this.executeSwapTron(path, data, address);
                    console.log(response);
                    return response;
                }
                else {
                    if ((yield this.approveSwap(tokenFrom, request.amount)).hash !== null) {
                        let amountInSun = request.amount * BigInt((Math.pow(10, tokenFrom.decimals)));
                        const path = [tokenTo.address, address];
                        const data = {
                            amountIn: amountInSun,
                            amountOutMin: 0,
                            to: address,
                            deadline: deadline
                        };
                        const response = yield this.executeSwapTron(path, data, address);
                        return response;
                    }
                }
            }
            catch (error) {
                return error;
            }
        });
    }
    //private async swapTrx(walletAddress:string, token)
    // approve sunswap to access wallet address
    approveSwap(tokenAddress, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            let amountInSun = amount * (Math.pow(10, tokenAddress.decimals));
            amountInSun = this.tronWeb.toSun(amountInSun);
            // const tokenContract = await this.tronWeb.contract().at(tokenAddress.address);
            const tokenContract = yield this.tronWeb.contract(TRC20ABI, tokenAddress.address);
            const approveReq = yield tokenContract.approve(sunswapRouterAddress, amountInSun).send({
                shouldPoolResponse: true
            });
            return yield approveReq;
        });
    }
    // approve sunswap to access wallet address
    TokenBalance(tokenAddress, address) {
        return __awaiter(this, void 0, void 0, function* () {
            let balance = 0;
            if (tokenAddress.symbol === "TRX") {
                balance = this.tronWeb.trx.getBalance(address);
                //convert from sun to trx
                balance = this.tronWeb.fromSun(balance);
            }
            else {
                //const tokenContract = await this.tronWeb.contract(TRC20ABI,tokenAddress.address);
                const tokenContract = yield this.tronWeb.contract().at(tokenAddress.address);
                balance = tokenContract.balanceOf(address).call();
                //convert from sun to trx
                balance = this.tronWeb.fromSun(balance);
            }
            return balance;
        });
    }
    executeSwapTron(path, params, address) {
        return __awaiter(this, void 0, void 0, function* () {
            //const swapContract = await this.tronWeb.contract(sunswapABI, sunswapRouterAddress);
            const swapContract = yield this.tronWeb.contract().at(sunswapRouterAddress);
            console.log(swapContract);
            const swapReq = yield swapContract.methods.swapExactInput(path, [], [], [], params).send(address);
            return yield swapReq;
        });
    }
}
exports.swapServiceTron = swapServiceTron;
//# sourceMappingURL=swapServiceTron.js.map