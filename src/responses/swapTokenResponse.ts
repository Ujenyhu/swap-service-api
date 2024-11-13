export class swapTokenResponse {
    network: string;
    description: string;
    transactionHash: string;
    
    constructor(network: string, description: string, transactionHash: string) {
      this.network = network;
      this.description = description;
      this.transactionHash = transactionHash;
    }
}