require ("dotenv").config();
import { iSwapServiceEthereum } from "../interfaces/iSwapServiceEthereum";
import { swapTokenRequest } from "../../requests/swapTokenRequest";
import { abi as IUniswapV3FactoryPoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json';
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { abi as ISwapRouterV3ABI } from '@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json';
import { abi as IERC20 } from '@uniswap/v3-periphery/artifacts/contracts/interfaces/IERC20Metadata.sol/IERC20Metadata.json';
import { abi as IWETHABI } from '@uniswap/swap-router-contracts/artifacts/contracts/interfaces/IWETH.sol/IWETH.json';
import { abi as QuoterABI } from '@uniswap/v3-periphery/artifacts/contracts/interfaces/IQuoter.sol/IQuoter.json';
import { ethers, Contract, Wallet} from 'ethers';
import { getTokenBySymbol } from '../../helpers/token'
import { Token } from '@uniswap/sdk-core';
import { ResponseBase } from "../../responses/responseBase";
import { varhelper } from "../../helpers/varhelper";
import { swapTokenResponse } from "../../responses/swapTokenResponse";

  //Deployment addressess
  // Replace with actual Uniswap V3 pool factor address on Sepolia/Mainnet
  const poolFactoryAddress = '0x0227628f3F023bb0B980b67D528571c95c6DaC1c';
  const swapRouterAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564' // main et sepolia
   // Replace with actual Uniswap V3 quote address on Sepolia/Mainnet
  const quoteContractAddress = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6';

export class swapServiceEthereum implements iSwapServiceEthereum {
    private readonly provider: ethers.JsonRpcProvider;


    constructor() {
        
        //test net
        this.provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_PROJECT_ID}`);      
    }

    //Main method for swap 
    public async swapTokenEth(request: swapTokenRequest): Promise<any> {

        let response;

        const wallet = new Wallet(request.walletKey, this.provider);

        //Get token details you want to swap from
        const tokenFrom = getTokenBySymbol(request.fromToken);

        //Get token details you want to swap to
        const tokenTo = getTokenBySymbol(request.toToken);

        //parse amount, covert to wei
        request.amount =  ethers.parseUnits(request.amount.toString(), tokenFrom.decimals);


        //confirm if swap is from eth => any token so you can wrap before swapping
        try{

            if(tokenFrom.symbol === 'WETH') {

                //Check if wrapped ether already exist
               const balanceWeth =  await this.CheckTokenBalance(tokenFrom, wallet);
               console.log(`Weth balance ${ethers.formatEther(balanceWeth)}`);

                //Wrap if it does not          
                if((await this.wrapEth(request.amount, wallet)).status === 1) {
                    
                    if((await this.approveSwap(tokenFrom, request.amount, wallet)).status === 1){
                    
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

                        const reciept = await this.executeSwap(swapParams, wallet);

                        if(reciept.status !== 1){
                            await this.unwrapWeth(request.amount, wallet);
                            response = new ResponseBase<swapTokenResponse>(varhelper.HttpStatusCodes.InternalServerError, "Swap was unsuccessfull. Please try again", varhelper.ResponseStatus.ERROR);
                        }else{
                            const responseBody = new swapTokenResponse(request.network, `${request.fromToken} => ${request.toToken}`, reciept.hash);
                            response = new ResponseBase<swapTokenResponse>(varhelper.HttpStatusCodes.OK, "Swap was successfull", varhelper.ResponseStatus.SUCCESS, responseBody);
                        }
                        
                    }else{
                        
                        //unwrap weth if swap is not successful
                       await this.unwrapWeth(request.amount, wallet);
                       response = new ResponseBase<swapTokenResponse>(varhelper.HttpStatusCodes.InternalServerError, "Swap was unsuccessfull. Please try again", varhelper.ResponseStatus.ERROR);
                    }                                 
                }else{
                    response = new ResponseBase<swapTokenResponse>(varhelper.HttpStatusCodes.InternalServerError, "Swap was unsuccessfull. Please try again", varhelper.ResponseStatus.ERROR);
                }
               
                return response ; 
            }
            else{

                if((await this.approveSwap(tokenFrom, request.amount, wallet)).status === 1) {
                
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
    
                    const reciept = await this.executeSwap(swapParams, wallet);
                    if(reciept.status === 1){
    
                        if(tokenTo.symbol === ("WETH")){
                            // Retrieve the amount of WETH received from the swap
                            const formatEth = ethers.parseEther(request.amount.toString());
                           // const amountWeth = ethers.parseUnits(formatEth.toString(), tokenTo.decimals)
                            await this.unwrapWeth(null, wallet);
                        }
                        const responseBody = new swapTokenResponse(request.network, `${request.fromToken} => ${request.toToken}`, reciept.hash);
                        response = new ResponseBase<swapTokenResponse>(varhelper.HttpStatusCodes.OK, "Swap was successfull", varhelper.ResponseStatus.SUCCESS, responseBody);
                    }
    
                }else{
                    response = new ResponseBase<swapTokenResponse>(varhelper.HttpStatusCodes.InternalServerError, "Swap was unsuccessfull. Please try again", varhelper.ResponseStatus.ERROR);
                }

                return response;
            }
        }
        catch(error : any){
            //return error;
            return new ResponseBase(varhelper.HttpStatusCodes.InternalServerError, `Swap was unsuccessfull. ${error.error.message}`, varhelper.ResponseStatus.ERROR, error);
        }
        
    }


    public async estimateSwapEth(request: swapTokenRequest): Promise<any> {
        try
        {
            
           //Get token details you want to swap from
            const tokenFrom = getTokenBySymbol(request.fromToken);

            //Get token details you want to swap to
            const tokenTo = getTokenBySymbol(request.toToken);

            //parse amount, covert to wei
            request.amount =  ethers.parseUnits(request.amount.toString(), tokenFrom.decimals);

            const wallet = new Wallet(request.walletKey, this.provider);
            const amountOut = await this.quoteSwap(3000, request.amount, tokenFrom, tokenTo);
            return amountOut;
            
        }catch(error){
            return error;
        }
    }


    //check token balance
    private async CheckTokenBalance(token: Token, wallet: Wallet) {
        
        const tokenContract = new Contract(token.address, IERC20, wallet); 
        const balance = tokenContract.balanceOf(wallet.address);
        // if(token.symbol === "WETH"){
        //     const wethContract = new Contract(token.address, IWETHABI, wallet); 
        //     balance = await this.provider.getBalance(wallet.address);
        // }else{
        //     const tokenContract = new Contract(token.address, IERC20, this.provider); 
        //     balance = await tokenContract.balanceOf(wallet.address);
        // }
        return balance
    }


    //wrap eth
    private async wrapEth(amountIn: bigint, wallet: Wallet) {     
        const WETH = getTokenBySymbol("WETH")
        const wethContract = new Contract(WETH.address, IWETHABI, wallet);
        
        //wrap eth to weth
        const wrapTxReq = await wethContract.deposit({value: amountIn});     
        const wrapTx = await wrapTxReq.wait();
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
    }


    //unwrap eth
    private async unwrapWeth(amountIn: bigint | null, wallet: Wallet) {
        
        const WETH = getTokenBySymbol("WETH");

        // If amountIn is null or 0, fetch the WETH balance from the wallet
        if(amountIn === null){            
            amountIn = await this.CheckTokenBalance(WETH, wallet);
           //amountIn = ethers.parseEther(amount.toString())
           console.log(`WETH Bal: ${amountIn}`);       
        }

        // If amountIn is still 0 after fetching balance, exit the function
        if(amountIn === BigInt(0)){
            return;
        }
        
        const wethContract = new Contract(WETH.address, IWETHABI, wallet);
        const unwrapTxReq = await wethContract.withdraw(amountIn, {
            gasLimit: 100000
        });     
        const unwrapTx = await unwrapTxReq.wait();
        return unwrapTx;
        
    }


    //Approve uniswap to access wallet address
    private async approveSwap(tokenAddress: Token, amount:bigint, wallet: Wallet) {

        const tokenContract = new ethers.Contract(tokenAddress.address, IERC20, wallet);
        const approveTransactionReq = await tokenContract.approve(swapRouterAddress, amount);
        const approveReceipt = await approveTransactionReq.wait();
        //console.log(approveReceipt);
        return approveReceipt;
    }   


    //Swap token
    private async executeSwap(params: object, wallet: Wallet) {
        const swapRouter = new Contract(swapRouterAddress, ISwapRouterV3ABI, wallet)

        const transaction = await swapRouter.exactInputSingle(params);
        const reciept = await transaction.wait();
        console.log(`swap receipt ${reciept}`);
        return reciept;      

    }


    //Get Pool Details
    private async getPoolData(tokenInSymbol: string, tokenOutSymbol: string) {   

        const tokenIn = getTokenBySymbol(tokenInSymbol);
        const tokenOut = getTokenBySymbol(tokenOutSymbol);
        
        const poolFactoryContract = new Contract(poolFactoryAddress, IUniswapV3FactoryPoolABI, this.provider);
        const poolAddress = await poolFactoryContract.getPool(tokenIn.address, tokenOut.address, 3000);
        console.log(poolAddress);
        if (!poolAddress) {
            throw new Error("Failed to get pool address");
        }

        const poolContract = new Contract(poolAddress, IUniswapV3PoolABI, this.provider);
        console.log(poolContract);
        const [token0, token1, fee, slot] = await Promise.all([
            poolContract.token0(),
            poolContract.token1(),
            poolContract.fee(),
            poolContract.slot0()
        ]);

        console.log(token0, token1, fee, slot[0]);
        return { poolContract, token0, token1, fee, slot};
    }


    //Quote Swap Transaction
    private async quoteSwap(fee: number, amountIn: bigint, tokenFrom: Token, tokenTo: Token) : Promise<any> {
           
        const quoteContract = new Contract(quoteContractAddress, QuoterABI, this.provider);

        const quote = await quoteContract.quoteExactInputSingle.staticCall(
            tokenFrom.address,
            tokenTo.address,
            3000,
            // recipient: wallet.address,
            // deadline: Math.floor(new Date().getTime() / 1000 + 60 * 10),
            amountIn,
            0,
        );

        const quotedAmount = ethers.formatUnits(quote[0], tokenTo.decimals);
        return quotedAmount;
    }
    
}