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
exports.SwapService = void 0;
const varhelper_1 = require("../../helpers/varhelper");
const responseBase_1 = require("../../responses/responseBase");
class SwapService {
    constructor(swapEthereum, swapTron) {
        this.swapEthereum = swapEthereum;
        this.swapTron = swapTron;
    }
    swapToken(request) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (request.network.toUpperCase()) {
                case `${varhelper_1.varhelper.Network.ETHEREUM.toString()}`:
                    if (request.fromToken === 'ETH') {
                        request.fromToken = 'WETH';
                    }
                    if (request.toToken === 'ETH') {
                        request.toToken = 'WETH';
                    }
                    return this.swapEthereum.swapTokenEth(request);
                case `${varhelper_1.varhelper.Network.TRON.toString()}`:
                    return this.swapTron.swapTokenTron(request);
                default:
                    return new responseBase_1.ResponseBase(varhelper_1.varhelper.HttpStatusCodes.BadRequest, "Unsupported Network", varhelper_1.varhelper.ResponseStatus.ERROR);
            }
            ;
        });
    }
    estimateSwap(request) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (request.network.toUpperCase()) {
                case `${varhelper_1.varhelper.Network.ETHEREUM.toString()}`:
                    if (request.fromToken === 'ETH') {
                        request.fromToken = 'WETH';
                    }
                    if (request.toToken === 'ETH') {
                        request.toToken = 'WETH';
                    }
                    return this.swapEthereum.estimateSwapEth(request);
                default:
                    return new responseBase_1.ResponseBase(varhelper_1.varhelper.HttpStatusCodes.BadRequest, "Unsupported Network", varhelper_1.varhelper.ResponseStatus.ERROR);
            }
            ;
        });
    }
}
exports.SwapService = SwapService;
//# sourceMappingURL=SwapService.js.map