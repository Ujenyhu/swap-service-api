"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ServicesWrapper_1 = require("./logic/services/ServicesWrapper");
const swapController_1 = require("./controllers/swapController");
const router = (0, express_1.Router)();
const servicesWrapper = new ServicesWrapper_1.ServicesWrapper();
const _swapController = new swapController_1.swapController(servicesWrapper);
// Define routes
router.post('/swap', _swapController.swapTokens.bind(_swapController));
router.post('/estimateSwap', _swapController.estimateSwap.bind(_swapController));
exports.default = router;
//# sourceMappingURL=routes.js.map