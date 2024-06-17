import { createPublicClient, http, createWalletClient, formatEther, toHex, hexToString, parseEther } from "viem";
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
  if (!parameters || parameters.length < 3)
    throw new Error("Parameters not provided");

  const contractAddress = parameters[0] as `0x${string}`;
  if (!contractAddress) throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");

  const AddressToGIve = parameters[1] as `0x${string}`;
  if (!AddressToGIve) throw new Error("AddressToDelegate not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(AddressToGIve))
    throw new Error("Invalid AddressToDelegate address");

  const amount = parameters[2];
  try {
    parseEther(amount);
  } catch {
    throw new Error("Invalid amount");
  }

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

  console.log("Address to Give tokens and amount: ");
  const address = AddressToGIve;
  const _amount = amount;
  console.log("The address: ", address);
  console.log("The amount", _amount);
  console.log("Confirm? (Y/n)");

  const stdin = process.stdin;
  stdin.setEncoding('utf8');

  stdin.addListener('data', async function (d) {
  const input = d.toString().trim().toLowerCase();
  if (input !== 'n') {
    const hash = await delegator.writeContract({
      address: contractAddress,
      abi,
      functionName: 'transfer',
      args: [AddressToGIve, amount],
    });
    console.log('Transaction hash:', hash);
    console.log('Waiting for confirmations...');
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log('Transaction confirmed');
  } else {
       console.log('Operation cancelled');
  }
  process.exit();
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});