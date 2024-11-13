import { Router } from "express";
import { ServicesWrapper } from './logic/services/ServicesWrapper';
import { swapController } from './controllers/swapController';

const router =  Router();
const servicesWrapper =  new ServicesWrapper();
const _swapController = new swapController(servicesWrapper);

// Define routes

router.post('/swap',  _swapController.swapTokens.bind(_swapController));

router.post('/estimateSwap', _swapController.estimateSwap.bind(_swapController));

export default router;