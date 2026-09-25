import { defineChain } from "viem";

export const BOTCHAIN_GAS_PRICE = 20000000000n; // 20 Gwei minimum required by Botchain validator node

export const botchain = defineChain({
  id: Number(process.env.NEXT_PUBLIC_BOTCHAIN_CHAIN_ID ?? 677),
  name: "Botchain Mainnet",
  nativeCurrency: { name: "BOT", symbol: "BOT", decimals: 18 },
  rpcUrls: { default: { http: [process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL ?? "https://rpc.botchain.ai"] } },
  blockExplorers: { default: { name: "Botchain Explorer", url: process.env.NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL ?? "https://scan.botchain.ai" } },
  fees: {
    defaultPriorityFee: BOTCHAIN_GAS_PRICE,
    estimateFeesPerGas: async () => ({
      gasPrice: BOTCHAIN_GAS_PRICE,
    }),
  },
});

export const explorerUrl = process.env.NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL ?? "https://scan.botchain.ai";

