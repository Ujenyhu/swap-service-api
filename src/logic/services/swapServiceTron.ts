require ("dotenv").config();
const TronWeb = require('tronweb');
import { swapTokenRequest } from "../../requests/swapTokenRequest";
import { iSwapServiceTron } from "../interfaces/iSwapServiceTron";
const TRC20ABI  = require ('../../../abis/tron/trc20ABI.json');
const sunswapABI  = require ('../../../abis/tron/sunswapRouterABI.json');
import {TronToken, getTokenBySymbolTron } from '../../helpers/token'

// SunSwap router contract address
const sunswapRouterAddress = 'TFVisXFaijZfeyeSjCEVkHfex7HGdTxzF9'; 
export  class swapServiceTron implements iSwapServiceTron{
    
    private readonly tronWeb: any;

    constructor(){
        this.tronWeb = new TronWeb({
            fullHost: 'https://api.shasta.trongrid.io',
            headers: { "TRON-PRO-API-KEY": process.env.TRON_API_KEY },
        });       
    }
    
    setPrivateKey(userPrivateKey:string) {
        this.tronWeb.setPrivateKey(userPrivateKey);
    }

    public async swapTokenTron (request: swapTokenRequest){
        
        try{

           //pass in private key of user to sign transactions using tronweb
            this.setPrivateKey(request.walletKey);
            //console.log(this.tronWeb.privateKey);
            //Get token details you want to swap from
            const tokenFrom = getTokenBySymbolTron(request.fromToken.toUpperCase());

            //Get token details you want to swap to
            const tokenTo = getTokenBySymbolTron(request.toToken);

            const deadline = Math.floor(new Date().getTime() / 1000 + 60 * 10);
           // get address from privatekey
            const address = this.tronWeb.address.fromPrivateKey(request.walletKey);
            console.log(address);

            if(tokenFrom.symbol === "TRX"){

                let amountInSun = this.tronWeb.toSun(request.amount);
                const path = [address, tokenTo.address];
                const data = {
                    amountIn: amountInSun,
                    amountOutMin: 0,
                    to: address,
                    deadline: deadline
                }
                const response = await this.executeSwapTron(path, data, address);
                console.log(response);
                return response;
            }else{
            
                if((await this.approveSwap(tokenFrom, request.amount)).hash !== null){
                   
                    let amountInSun = request.amount * BigInt((10 ** tokenFrom.decimals));
                    const path = [tokenTo.address, address];
                    const data = {
                        amountIn: amountInSun,
                        amountOutMin: 0,
                        to: address,
                        deadline: deadline
                    }
                    const response = await this.executeSwapTron(path, data, address);
                    return response; 
                }
            }
        } 
        catch(error) {
         return error;
        }

    }


    //private async swapTrx(walletAddress:string, token)

    // approve sunswap to access wallet address
    private async approveSwap(tokenAddress: TronToken, amount:any) {
        
        let amountInSun = amount * (10 ** tokenAddress.decimals);
        amountInSun = this.tronWeb.toSun(amountInSun);
        // const tokenContract = await this.tronWeb.contract().at(tokenAddress.address);
        const tokenContract = await this.tronWeb.contract(TRC20ABI,tokenAddress.address);
        const approveReq = await tokenContract.approve(sunswapRouterAddress, amountInSun).send({
            shouldPoolResponse: true
        });
        return await approveReq;
    } 

    // approve sunswap to access wallet address
    private async TokenBalance(tokenAddress: TronToken, address: string) {
        let balance = 0;
        if(tokenAddress.symbol === "TRX"){
            balance = this.tronWeb.trx.getBalance(address);
            
            //convert from sun to trx
            balance = this.tronWeb.fromSun(balance);
        }else{             
            //const tokenContract = await this.tronWeb.contract(TRC20ABI,tokenAddress.address);
            const tokenContract = await this.tronWeb.contract().at(tokenAddress.address);
            balance = tokenContract.balanceOf(address).call();

            //convert from sun to trx
            balance = this.tronWeb.fromSun(balance);
        }

        return balance;
    } 

    private async executeSwapTron(path:string[], params:object, address: string){
        
        //const swapContract = await this.tronWeb.contract(sunswapABI, sunswapRouterAddress);
        const swapContract = await this.tronWeb.contract().at(sunswapRouterAddress);
        console.log(swapContract);
        const swapReq = await swapContract.methods.swapExactInput(path, [], [], [], params).send(address);
        return await swapReq;
    }

}
