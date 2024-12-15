# Swap Service Api
This is a microservice designed with Node.js, Typescript for token swaps on the Ethereum and Tron blockchain networks. 
 For production use and to ensure security, it is recommended to interact with this service via an API gateway.

## Features
- **Swagger (OPEN API)**: Integrated for comprehensive API documentation and ease of debugging.
  
- **Uniswap and Sunswap**: Relies on Uniswap and Sunswap contracts for swap interactions
  
- **Token Swap**: Users can swap tokens on Ethereum and tron testnet/mainet depending on the Uniswap's or Sunswap's router contracts passed, simulating real-world token swap functionality.
  
- **Testnet Compatibility**: Supports Sepolia testnets, ideal for development and testing without the need for real assets.

NOTE: My background in C# has influenced my TypeScript style; I’ve implemented the repository pattern, which has facilitated a smoother transition for me into api development with Node.js .

## Table of Contents
- [Installation](#Installation)
- [Setup](#Setup)
- [Usage](#Usage)
- [Architecture](#Architecture)
- [Best Practices for Production](#best)

## Installation
 Prerequisites
- Node.js (version 16 or later)
- TypeScript (if not already installed globally)

## Setup
Clone the Repository:
 git clone https://github.com/Ujenyhu/swap-service-api.git

## Dependencies:
  - Ethereum blockchain node providers for mainnet or testnet (e.g., Infura, Alchemy, or similar)
  - Uniswap and Sunswap for ethereum and tron respectively
  - Ethers.js

## Usage
API Endpoints
Once running, the Swagger documentation can be accessed at /api, providing an interactive UI to explore available endpoints and test the API.

## Architecture
Repository Pattern: This project uses the repository pattern to abstract data access and facilitate testing. This approach provides a separation between business logic and data interaction layers, improving code reusability and maintainability.

## Best Practices for Production
- API Gateway: Use an API gateway to control access to the service, manage rate limiting, and apply additional security measures.

- Environment-Specific Configuration: Set up environment variables for configuration details. Avoid hardcoding sensitive information in your codebase. 
 #### Example:
Create a .env file in the root directory, specifying your RPC URLs, Uniswap and sunswap router contract addresses, and any necessary keys:
- ETH_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
- UNISWAP_ROUTER_ADDRESS=0xYourRouterAddress
- SUNSWAP_ROUTER_ADDRESS=0xYourRouterAddress
