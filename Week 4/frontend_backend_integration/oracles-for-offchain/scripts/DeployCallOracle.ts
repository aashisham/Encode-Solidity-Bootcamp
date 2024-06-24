import {
    createPublicClient,
    http,
    createWalletClient,
    formatEther,
  } from "viem";
  import { privateKeyToAccount } from "viem/accounts";
  import { sepolia } from "viem/chains";
  import {
    abi,
    bytecode,
  } from "../artifacts/contracts/CallOracle.sol/CallOracle.json";
  import * as dotenv from "dotenv";
  dotenv.config();
  
  const providerApiKey = process.env.ALCHEMY_API_KEY || "";
  const deployerPrivateKey = process.env.PRIVATE_KEY || "";
  
  const TELLOR_ORACLE_ADDRESS = "0xB19584Be015c04cf6CFBF6370Fe94a58b7A38830";
  
  async function main() {
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });
    const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
    const deployer = createWalletClient({
      account,
      chain: sepolia,
      transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });
    console.log("Deployer address:", deployer.account.address);
    const balance = await publicClient.getBalance({
      address: deployer.account.address,
    });
    console.log(
      "Deployer balance:",
      formatEther(balance),
      deployer.chain.nativeCurrency.symbol
    );
    console.log("Deploying CallOracle contract");
    const hash = await deployer.deployContract({
      abi,
      bytecode: bytecode as `0x${string}`,
      args: [TELLOR_ORACLE_ADDRESS],
    });
    console.log("Transaction hash:", hash);
    console.log("Waiting for confirmations...");
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log("CallOracle contract deployed to:", receipt.contractAddress);
  
    const btcSpotPrice = await publicClient.readContract({
      address: receipt.contractAddress as `0x${string}`,
      abi,
      functionName: "getBtcSpotPrice",
      args: [180 * 24 * 60 * 60],
    });
  
    console.log(
      `The last value for BTC Spot Price for the ${
        sepolia.name
      } network is ${formatEther(btcSpotPrice as bigint)} USD`
    );
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });