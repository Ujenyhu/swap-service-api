import {swapTokenRequest} from '../../requests/swapTokenRequest';

export interface iSwapService{
   swapToken(request: swapTokenRequest): Promise<any>;
   estimateSwap(request: swapTokenRequest): Promise<any>;
}