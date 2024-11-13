import { iSwapServiceEthereum } from "./iSwapServiceEthereum";
import { iSwapService } from "./iSwapService";
import { iSwapServiceTron } from "./iSwapServiceTron";

export interface iServicesWrapper{
    getServiceEthereum(): iSwapServiceEthereum;
    getSwapService(): iSwapService;
    getServiceTron(): iSwapServiceTron;
}