import { createPublicClient, http, createWalletClient, formatEther, toHex, hexToString, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { abi, bytecode } from "../artifacts/contracts/MyERC20.sol/MyToken.json";

import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    throw new Error("Initial supply argument not provided");
  }

  const initialSupply = args[0];
  try {
    parseEther(initialSupply);
  } catch {
    throw new Error("Invalid initial supply amount");
  }

  // Public client
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  const blockNumber = await publicClient.getBlockNumber();
  console.log("Last block number:", blockNumber);

  // Wallet client
  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const deployer = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  console.log("Deployer address:", account.address);
  const balance = await publicClient.getBalance({ address: account.address });
  console.log("Deployer balance:", formatEther(balance), "ETH");

  // Deploy contract
  console.log("\nDeploying MyToken Contract");
  const hash = await deployer.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    args: [parseEther(initialSupply).toString()],
  });
  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmations...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("MyToken contract deployed to:", receipt.contractAddress);

  const name = await publicClient.readContract({
    address: receipt.contractAddress as `0x${string}`,
    abi,
    functionName: "name",
  });

  const symbol = await publicClient.readContract({
    address: receipt.contractAddress as `0x${string}`,
    abi,
    functionName: "symbol",
  });

  console.log("Token Name:", name);
  console.log("Token Symbol:", symbol);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});