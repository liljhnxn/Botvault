import { defineChain } from "viem";

export const BOTCHAIN_GAS_PRICE = 20000000000n; // 20 Gwei minimum required by Botchain validator node

export const cleanRpcUrl = (process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL?.trim() || "https://rpc.botchain.ai").replace(/[\r\n\t ]+/g, "");
export const cleanExplorerUrl = (process.env.NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL?.trim() || "https://scan.botchain.ai").replace(/[\r\n\t ]+/g, "");
export const cleanChainId = Number((process.env.NEXT_PUBLIC_BOTCHAIN_CHAIN_ID?.trim() || "677").replace(/[\r\n\t ]+/g, "")) || 677;

export const botchain = defineChain({
  id: cleanChainId,
  name: "Botchain Mainnet",
  nativeCurrency: { name: "BOT", symbol: "BOT", decimals: 18 },
  rpcUrls: { default: { http: [cleanRpcUrl] } },
  blockExplorers: { default: { name: "Botchain Explorer", url: cleanExplorerUrl } },
  fees: {
    defaultPriorityFee: BOTCHAIN_GAS_PRICE,
    estimateFeesPerGas: async () => ({
      gasPrice: BOTCHAIN_GAS_PRICE,
    }),
  },
});

export const explorerUrl = cleanExplorerUrl;


