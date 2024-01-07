import * as dotenv from "dotenv";
import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { defineChain } from "viem";
dotenv.config();

import { counterfactualAddress } from "../accountInfo.json";

const PRIV_KEY = process.env.PRIV_KEY!;
const ALCHEMY_API_URL = process.env.ALCHEMY_API_URL!;

const polygonMumbai = /*#__PURE__*/ defineChain({
  id: 80_001,
  name: 'Polygon Mumbai',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.ankr.com/polygon_mumbai'],
    },
    alchemy: {
      http: ['https://polygon-mumbai.g.alchemy.com/v2']
    }
  },
  blockExplorers: {
    default: {
      name: 'PolygonScan',
      url: 'https://mumbai.polygonscan.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 25770160,
    },
  },
  testnet: true,
})

async function main() {
  const account = privateKeyToAccount(`0x${PRIV_KEY}`);

  const wallet = createWalletClient({
    account: account,
    chain: polygonMumbai,
    transport: http(ALCHEMY_API_URL),
  });

  const txHash = await wallet.sendTransaction({
    to: counterfactualAddress as `0x${string}`,
    value: parseEther("0.1"),
  });

  return txHash;
}

main().then((txHash) => {
  console.log("Transaction hash: ", txHash);
});
