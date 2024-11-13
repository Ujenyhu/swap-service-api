import {swapTokenRequest} from '../../requests/swapTokenRequest';

export interface iSwapServiceTron{
    swapTokenTron(request: swapTokenRequest): Promise<any>;
}