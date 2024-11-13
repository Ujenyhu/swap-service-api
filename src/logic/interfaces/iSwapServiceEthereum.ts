import {swapTokenRequest} from '../../requests/swapTokenRequest';

export interface iSwapServiceEthereum{
    swapTokenEth(request: swapTokenRequest): Promise<any>;
    estimateSwapEth(request: swapTokenRequest): Promise<any>;
   // checkWETHBalance(request: GetWethBalance): Promise<any>;
}