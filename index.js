import {
    LightSmartContractAccount,
    getDefaultLightAccountFactoryAddress,
  } from "@alchemy/aa-accounts";
  import { AlchemyProvider } from "@alchemy/aa-alchemy";
  import { LocalAccountSigner } from "@alchemy/aa-core";
  import { defineChain } from 'viem'
  
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

  const chain = polygonMumbai;

  
  
  // The private key of your EOA that will be the owner of Light Account
  // Our recommendation is to store the private key in an environment variable
  const PRIVATE_KEY = "0xb22b52cadf5b8a828472b2b3356ce4b7c3ec5092b5ed2a868ed51db3ac620c1c";
  const owner = LocalAccountSigner.privateKeyToAccountSigner(PRIVATE_KEY);
  
  // Create a provider to send user operations from your smart account
  const provider = new AlchemyProvider({
    // get your Alchemy API key at https://dashboard.alchemy.com
    apiKey: "kIbxGNByWiwuTZykryjsDc1HU7PpYhfV",
    chain,
  }).connect(
    (rpcClient) =>
      new LightSmartContractAccount({
        rpcClient,
        owner,
        chain,
        factoryAddress: getDefaultLightAccountFactoryAddress(chain),
      })
  );
  
  (async () => {
    // Fund your account address with ETH to send for the user operations
    // (e.g. Get Sepolia ETH at https://sepoliafaucet.com)
    console.log("Smart Account Address: ", await provider.getAddress()); // Log the smart account address
  })();