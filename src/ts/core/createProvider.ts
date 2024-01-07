import {
  LightSmartContractAccount,
  getDefaultLightAccountFactoryAddress,
} from "@alchemy/aa-accounts";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { LocalAccountSigner, SmartAccountSigner } from "@alchemy/aa-core";
import * as dotenv from "dotenv";
import { privateKeyToAccount } from "viem/accounts";
import { defineChain } from "viem";

dotenv.config();

const PRIV_KEY = process.env.PRIV_KEY!;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY!;

const ENTRYPOINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

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

export default async function createProvider() {
  const chain: any = polygonMumbai;
  const PRIVATE_KEY = PRIV_KEY; // Replace with the private key of your EOA that will be the owner of Light Account

  const eoaSigner: SmartAccountSigner =
    LocalAccountSigner.privateKeyToAccountSigner(`0x${PRIVATE_KEY}`); // Create a signer for your EOA

  const account = privateKeyToAccount(`0x${PRIVATE_KEY}`);

  // Create a provider with your EOA as the smart account owner, this provider is used to send user operations from your smart account and interact with the blockchain
  const provider = new AlchemyProvider({
    apiKey: ALCHEMY_API_KEY, // or replace with your Alchemy API key, you can get one at https://dashboard.alchemy.com/
    chain,
    // Entrypoint address, you can use a different entrypoint if needed, check out https://docs.alchemy.com/reference/eth-supportedentrypoints for all the supported entrypoints
    entryPointAddress: ENTRYPOINT_ADDRESS,
  }).connect(
    (rpcClient) =>
      new LightSmartContractAccount({
        entryPointAddress: ENTRYPOINT_ADDRESS,
        chain,
        owner: eoaSigner,
        factoryAddress: getDefaultLightAccountFactoryAddress(chain), // Default address for Light Account on polygonMumbai, you can replace it with your own.
        rpcClient,
      })
  );

  return provider;
}
