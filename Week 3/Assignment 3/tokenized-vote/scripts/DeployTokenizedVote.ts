import { createPublicClient, http, createWalletClient, formatEther, toHex, hexToString } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { abi, bytecode } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

// Hardcoded parameters
const proposals = ["Proposal 1", "Proposal 2", "Proposal 3"].map(name => toHex(name, { size: 32 }));
const tokenContractAddress = "0x6164f2d4a223cd8e473fcd7ad7eaba6879af110f" as `0x${string}`;
const targetBlockNumber = "6118765";

async function main() {
  // Validate token contract address
  if (!tokenContractAddress) throw new Error("Token contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(tokenContractAddress))
    throw new Error("Invalid token contract address");

  // Validate target block number
  if (isNaN(Number(targetBlockNumber))) throw new Error("Invalid target block number");

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
  console.log("\nDeploying TokenizedBallot Contract");
  try {
    const hash = await deployer.deployContract({
      abi,
      bytecode: bytecode as `0x${string}`,
      args: [proposals, tokenContractAddress, targetBlockNumber],
    });
    console.log("Transaction hash:", hash);
    console.log("Waiting for confirmations...");
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log("TokenizedBallot contract deployed to:", receipt.contractAddress);

    console.log("Proposals: ");
    for (let index = 0; index < proposals.length; index++) {
      const proposal = (await publicClient.readContract({
        address: receipt.contractAddress as `0x${string}`,
        abi,
        functionName: "proposals",
        args: [BigInt(index)],
      })) as any[];
      const name = hexToString(proposal[0], { size: 32 });
      console.log({ index, name, proposal });
    }
  } catch (error) {
    console.error("Error deploying contract:", error);
  }
}

main().catch((error) => {
  console.error("Script execution failed:", error);
  process.exitCode = 1;
});