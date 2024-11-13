import { iServicesWrapper } from "../interfaces/iServicesWrapper";
import { iSwapServiceEthereum } from "../interfaces/iSwapServiceEthereum";
import { iSwapService } from "../interfaces/iSwapService";
import { swapServiceEthereum } from "../services/swapServiceEthereum";
import { SwapService } from "./SwapService";
import { iSwapServiceTron } from "../interfaces/iSwapServiceTron";
import { swapServiceTron } from "./swapServiceTron";

export class ServicesWrapper implements iServicesWrapper{
    private  ethereumSwapService: iSwapServiceEthereum;
    private tronSwapService: iSwapServiceTron
    private swapService : iSwapService
    
    constructor(){
        this.ethereumSwapService = new swapServiceEthereum();
        this.tronSwapService = new swapServiceTron();
        this.swapService = new SwapService(this.ethereumSwapService, this.tronSwapService);
    }

    getServiceEthereum(): iSwapServiceEthereum{
        return this.ethereumSwapService;
    }

    getSwapService(): iSwapService {
        return this.swapService;
    }

    getServiceTron(): iSwapServiceTron {
        return this.tronSwapService;
    }
}
