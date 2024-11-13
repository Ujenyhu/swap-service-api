export class swapTokenRequestTron {
  network: string;
  fromToken: string;
  toToken: string;
  address: string;
  amount: number;
  
  constructor(network: string, fromToken: string, toToken: string, address: string, amount: number) {
    this.network = network;
    this.fromToken = fromToken;
    this.toToken = toToken;
    this.address = address;
    this.amount = amount;
  }
}
