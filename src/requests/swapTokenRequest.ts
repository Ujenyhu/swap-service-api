export class swapTokenRequest {
  network: string;
  fromToken: string;
  toToken: string;
  walletKey: string;
  amount: bigint;
  
  constructor(network: string, fromToken: string, toToken: string, walletKey: string, amount: bigint) {
    this.network = network;
    this.fromToken = fromToken;
    this.toToken = toToken;
    this.walletKey = walletKey;
    this.amount = amount;
  }
}
