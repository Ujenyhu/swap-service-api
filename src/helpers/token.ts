import { Token, ChainId } from "@uniswap/sdk-core"

export class TronToken {
    address: string;
    decimals: number;
    symbol: string;
    name: string;
  
    constructor(address: string, decimals: number, symbol: string, name: string) {
      this.address = address;
      this.decimals = decimals;
      this.symbol = symbol;
      this.name = name;
    }
  }

// Define a type for the token map
export type TokenMapEth = {
    [symbol: string]: Token;
};

// Define a type for the token map
export type TokenMapTron = {
    [symbol: string]: TronToken;
};


//Define Tokens Eth
const tokenMap: TokenMapEth = {

    WETH: new Token(
        ChainId.SEPOLIA, // Ethereum Mainnet
        '0xfff9976782d46cc05630d1f6ebab18b2324d6b14', //sepolia 
       // '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH contract address on main
        18, // WETH has 18 decimals
        'WETH',
        'Wrapped Ether'
    ),
    
    USDT:  new Token(
        ChainId.SEPOLIA, // Ethereum Mainnet
        '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0', //USDT contract address in sepolia
        //'0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT contract address main
        6, // USDT has 6 decimals
        'USDT',
        'Tether USD',
    ),

    USDC: new Token(
        ChainId.SEPOLIA,
        //'0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // Main
        '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',// sepolia
        6,
        'USDC',
        'USD//C',
    ),

    T_USDT: new Token(
        ChainId.SEPOLIA,
        '0x738C68fef0dCf4ADEFF075c8C81deCa621674a9d', // sepolia
        6,
        'T_USDT',
        'Test USDT',
    )  
    //Add more tokens
}

//Define Tokens Tron
const tokenMapTron: TokenMapTron = {

    TRX: new TronToken(
        '', // TRX has no contract address
        6, 
        'TRX',
        'Tronix'
    ),


    WTRX: new TronToken(
        //'0xfff9976782d46cc05630d1f6ebab18b2324d6b14', //test 
        'TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR', // WTRX contract address on main
        6, // WTRX has 6 decimals
        'WTRX',
        'Wrapped Tronix'
    ),
    
    USDT:  new TronToken(
       // 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', // USDT contract address main-tronscan
        'TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs', // USDT contract address shasta testnet
        6, // USDT has 6 decimals
        'USDT',
        'Tether USD',
    ),

    //Add more tokens
}

export function getTokenBySymbol(symbol: string): Token {
   const token = tokenMap[symbol.toUpperCase()];
   if(!token) {
    throw new Error(`Token with symbol ${symbol} not found`);
   }else{
    return token;
   }
  
}

export function getTokenBySymbolTron(symbol: string): TronToken {
    const token = tokenMapTron[symbol.toUpperCase()];
    if(!token) {
     throw new Error(`Token with symbol ${symbol} not found`);
    }else{
     return token;
    }
   
}

