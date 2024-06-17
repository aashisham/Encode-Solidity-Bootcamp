import { createPublicClient, http, createWalletClient, formatEther, toHex, hexToString } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { abi, bytecode } from "../artifacts/contracts/MyERC20.sol/MyToken.json";

import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";


async function main() {
  //params
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 2)
    throw new Error("Parameters not provided");

  const contractAddress = parameters[0] as `0x${string}`;
  if (!contractAddress) throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");

  const voterAddress = parameters[1] as `0x${string}`;
  if (!voterAddress) throw new Error("voterAddress not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(voterAddress))
    throw new Error("Invalid voterAddress address");

  //public client
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  //wallet client
  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const delegator = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  const votes = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getVotes",
    args: [voterAddress],
  }));
  // const winnerName = hexToString(winner as `0x${string}`, {size: 32});
  console.log(
    `Account ${
      voterAddress
    } has ${votes} units of voting power after self delegating\n`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});