import { Request, Response } from "express";
import { iServicesWrapper } from "../logic/interfaces/iServicesWrapper";
import { swapTokenRequest } from "../requests/swapTokenRequest";
import { ResponseBase} from "../responses/responseBase";

export class swapController {
  private servicesWrapper: iServicesWrapper;

  constructor(_servicesWrapper: iServicesWrapper) {
    this.servicesWrapper = _servicesWrapper;
  }

  
  public async swapTokens(req: Request, res: Response): Promise<void> {

    const requestBody = req.body as swapTokenRequest;
    const result = await this.servicesWrapper.getSwapService().swapToken(requestBody);
    res.status(result.statusCode).json(result);

  }

  public async estimateSwap(req: Request, res: Response): Promise<void> {
    const requestBody = req.body as swapTokenRequest;
    const result = await this.servicesWrapper.getSwapService().estimateSwap(requestBody);
    res.status(result.statusCode).json(result);
  }
}
