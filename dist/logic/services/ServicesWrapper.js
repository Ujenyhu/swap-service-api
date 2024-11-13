"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesWrapper = void 0;
const swapServiceEthereum_1 = require("../services/swapServiceEthereum");
const SwapService_1 = require("./SwapService");
const swapServiceTron_1 = require("./swapServiceTron");
class ServicesWrapper {
    constructor() {
        this.ethereumSwapService = new swapServiceEthereum_1.swapServiceEthereum();
        this.tronSwapService = new swapServiceTron_1.swapServiceTron();
        this.swapService = new SwapService_1.SwapService(this.ethereumSwapService, this.tronSwapService);
    }
    getServiceEthereum() {
        return this.ethereumSwapService;
    }
    getSwapService() {
        return this.swapService;
    }
    getServiceTron() {
        return this.tronSwapService;
    }
}
exports.ServicesWrapper = ServicesWrapper;
//# sourceMappingURL=ServicesWrapper.js.map