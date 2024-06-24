import { Injectable } from '@nestjs/common';
import {Address, createPublicClient, createWalletClient, formatUnits, http } from 'viem';
import { sepolia } from 'viem/chains';
import * as tokenJson from './assets/MyToken.json';
import 'dotenv/config';
import { privateKeyToAccount } from 'viem/accounts';

@Injectable()
export class AppService {
  
  publicClient;
  walletClient;

  constructor() {
    this.publicClient = createPublicClient({
      chain: sepolia ,
      transport : http(process.env.RPC_ENDPOINT_URL) ,
    });

    this.walletClient = createWalletClient({
      account: privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`),
      chain: sepolia ,
      transport : http(process.env.RPC_ENDPOINT_URL),
    });

     // above creating walletclient also can be done like this
    // const deployerPrivateKey = process.env.PRIVATE_KEY || '';
    // const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
    // const deployer = createWalletClient({
    //   account,
    //   chain: sepolia ,
    //   transport : http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    // });



  }
 
  getTransactionReceipt(hash: string) {
    return this.publicClient.getTransactionReceipt(hash);
  }
  
  async getTokenBalance(address: string) {
    const balance = await this.publicClient.readContract({
    address: this.getContractAddress(),
    abi: tokenJson.abi,
    functionName: 'balanceOf',
    args: [address],
    });
    
    const symbol = await this.publicClient.readContract({
    address: this.getContractAddress(),
    abi: tokenJson.abi,
    functionName: 'symbol',
    });
    
    const decimals = await this.publicClient.readContract({
    address: this.getContractAddress(),
    abi: tokenJson.abi,
    functionName: 'decimals',
    });
    
    const balanceString = `${formatUnits(balance, decimals)} ${symbol}`;
    return balanceString;
  }


  async getTotalSupply() {
    const supply = await this.publicClient.readContract({
    address: this.getContractAddress(),
    abi: tokenJson.abi,
    functionName: 'totalSupply',
    });
    
    const symbol = await this.publicClient.readContract({
    address: this.getContractAddress(),
    abi: tokenJson.abi,
    functionName: 'symbol',
    });
    
    const decimals = await this.publicClient.readContract({
    address: this.getContractAddress(),
    abi: tokenJson.abi,
    functionName: 'decimals',
    });
    
    const supplyString = `${formatUnits(supply, decimals)} ${symbol}`;
    return supplyString;
  }
  
  
  getHello(): string {
    return 'Hello there!';
  }

  getContractAddress(): Address {
    return process.env.TOKEN_ADDRESS as Address ;
  }

  async getTokenName(): Promise<any> {
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(process.env.RPC_ENDPOINT_URL),
    });
    const name = await publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "name"
    });
    return name;
  }

  getServerWalletAddress() {
    return this.walletClient.account.address;
  }

  async checkMinterRole(address: string) {
    // we can hardcode this minter role to save one call to blockchain
    // const MINTER_ROLE= "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6" ;
    
    const MINTER_ROLE =await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: 'MINTER_ROLE',
    }) ;
    const hasRole = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "hasRole",
      args: [MINTER_ROLE , address],
    });

    return hasRole
    ? `Address ${address} has Minter Role`
    : `Address ${address} does not have Minter Role`
    ;
    
  }

  mintTokens(address: any) {
    // TODO : mint the tokens and get the receipts 
    const hash = "0xTODO";
    return hash ;
  }

}
