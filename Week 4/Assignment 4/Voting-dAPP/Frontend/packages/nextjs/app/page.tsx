"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount, useWalletClient } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useEffect, useState } from "react";
import { createPublicClient, http, createWalletClient, formatEther, toHex, hexToString, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

// Public client
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
});

// Wallet client
const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
const delegator = createWalletClient({
  account,
  chain: sepolia,
  transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
});

const Home: NextPage = () => {
  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5">
        <h1 className="text-center mb-8">
          <span className="block text-2xl mb-2">Welcome to</span>
          <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
        </h1>
        <p className="text-center text-lg">
          Get started by editing{" "}
          <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
            packages/nextjs/pages/index.tsx
          </code>
        </p>
        <PageBody />
      </div>
    </div>
  );
};

const PageBody = () => {
  const proposals: Proposal[] = [
    { id: 1, name: 'Proposal 1' },
    { id: 2, name: 'Proposal 2' },
    { id: 3, name: 'Proposal 3' },
  ];

  return (
    <div className="text-center text-lg">
      <p>Here we are!</p>
      <div className="mt-8 space-y-8">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-bold mb-4">Request Tokens</h2>
          <RequestTokens />
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-bold mb-4">Delegate</h2>
          <Delegate />
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-bold mb-4">Vote</h2>
          <Vote proposals={proposals} />
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-bold mb-4">Query Result</h2>
          <QueryResult />
        </div>
      </div>
    </div>
  );
};

const Delegate = () => {
  const [delegateAddress, setDelegateAddress] = useState("");

  const abi = [
    {
      inputs: [{ internalType: "address", name: "delegatee", type: "address" }],
      name: "delegate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const delegate = async () => {
    try {
      const contractAddress = "0x6164f2d4a223cd8e473fcd7ad7eaba6879af110f";
      const hash = await delegator.writeContract({
        address: contractAddress,
        abi,
        functionName: "delegate",
        args: [delegateAddress],
      });
      console.log('Transaction hash:', hash);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log('Transaction confirmed', receipt);
    } catch (error) {
      console.error('Delegation failed', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Delegatee Address"
        value={delegateAddress}
        onChange={(e) => setDelegateAddress(e.target.value)}
        className="input input-bordered w-full max-w-xs mb-4"
      />
      <button className="btn btn-active btn-neutral" onClick={delegate}>
        Delegate
      </button>
    </div>
  );
};

interface Proposal {
  id: number;
  name: string;
}

interface VoteProps {
  proposals: Proposal[];
}

const Vote: React.FC<VoteProps> = ({ proposals }) => {
  const [selectedProposal, setSelectedProposal] = useState(proposals.length > 0 ? proposals[0].id : '');
  const [amount, setAmount] = useState('');

  const abi = [
    {
      inputs: [
        { internalType: "uint256", name: "proposal", type: "uint256" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "vote",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const vote = async () => {
    try {
      const contractAddress = "0x82490d26f8bb201807de1ed176b58b5554a45735";
      const hash = await delegator.writeContract({
        address: contractAddress,
        abi,
        functionName: "vote",
        args: [selectedProposal, amount],
      });
      console.log('Transaction hash:', hash);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log('Transaction confirmed', receipt);
    } catch (error) {
      console.error('Voting failed', error);
    }
  };

  return (
    <div>
      <select
        value={selectedProposal}
        onChange={(e) => setSelectedProposal(parseInt(e.target.value))}
        className="select select-bordered w-full max-w-xs mb-4"
      >
        {proposals.map((proposal) => (
          <option key={proposal.id} value={proposal.id}>
            {proposal.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="input input-bordered w-full max-w-xs mb-4"
      />
      <button className="btn btn-active btn-neutral" onClick={vote}>
        Vote
      </button>
    </div>
  );
};

const QueryResult = () => {
  const [winner, setWinner] = useState("");
  const abi = [
    {
      inputs: [],
      name: "winnerName",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
  ];

  const result = async () => {
    try {
      const contractAddress = "0x82490d26f8bb201807de1ed176b58b5554a45735";
      const lead = await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "winnerName",
      });
      setWinner(hexToString(lead as `0x${string}`, { size: 32 }));
    } catch (error) {
      console.error('Query failed', error);
    }
  };

  return (
    <div>
      <button className="btn btn-active btn-neutral mb-4" onClick={result}>
        Query Result
      </button>
      {winner && (
        <div className="p-2 border rounded-lg">
          <p className="mt-2">Winner: {winner}</p>
        </div>
      )}
    </div>
  );
};

const RequestTokens = () => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [data, setData] = useState<{ result: boolean }>();
  const [isLoading, setLoading] = useState(false);

  const requestTokens = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/mint-tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, amount }),
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Token request failed', error);
      setData({ result: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="input input-bordered w-full max-w-xs mb-4"
      />
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="input input-bordered w-full max-w-xs mb-4"
      />
      {isLoading ? (
        <p>Requesting tokens from API...</p>
      ) : (
        <>
          {!data ? (
            <button className="btn btn-active btn-neutral" onClick={requestTokens}>
              Request tokens
            </button>
          ) : (
            <p>Result from API: {data.result ? 'worked' : 'failed'}</p>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
