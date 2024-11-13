import { swapTokenRequest } from "../../requests/swapTokenRequest";
import { iSwapService } from "../interfaces/iSwapService";
import { iSwapServiceEthereum } from "../interfaces/iSwapServiceEthereum";
import { iSwapServiceTron } from "../interfaces/iSwapServiceTron";
import { varhelper } from "../../helpers/varhelper";
import { ResponseBase } from "../../responses/responseBase";

export class SwapService implements iSwapService{
    private swapEthereum : iSwapServiceEthereum;
    private swapTron : iSwapServiceTron;

    constructor(swapEthereum : iSwapServiceEthereum, swapTron : iSwapServiceTron){
        this.swapEthereum = swapEthereum;
        this.swapTron = swapTron;
    }

    async swapToken(request: swapTokenRequest): Promise<any> {
        switch(request.network.toUpperCase()){
            case `${varhelper.Network.ETHEREUM.toString()}` :
            
                if( request.fromToken === 'ETH'){
                    request.fromToken = 'WETH';
                }      
                if(request.toToken === 'ETH'){
                request.toToken = 'WETH';
                }  
                return this.swapEthereum.swapTokenEth(request);
            case `${varhelper.Network.TRON.toString()}` :
                return this.swapTron.swapTokenTron(request);
          default:
            return new ResponseBase(varhelper.HttpStatusCodes.BadRequest, "Unsupported Network", varhelper.ResponseStatus.ERROR);
        };
    }

    async estimateSwap(request: swapTokenRequest): Promise<any> {
        switch(request.network.toUpperCase()){
            case `${varhelper.Network.ETHEREUM.toString()}` :
                if( request.fromToken === 'ETH'){
                    request.fromToken = 'WETH';
                }      
                if(request.toToken === 'ETH'){
                   request.toToken = 'WETH';
                } 
            return this.swapEthereum.estimateSwapEth(request);
  
          default:
            return new ResponseBase(varhelper.HttpStatusCodes.BadRequest, "Unsupported Network", varhelper.ResponseStatus.ERROR);
        };
    }
}