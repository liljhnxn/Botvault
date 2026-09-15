import { defineChain } from "viem";

export const botchainTestnet = defineChain({
  id: Number(process.env.NEXT_PUBLIC_BOTCHAIN_CHAIN_ID ?? 968),
  name: "Botchain Testnet",
  nativeCurrency: { name: "BOT", symbol: "BOT", decimals: 18 },
  rpcUrls: { default: { http: [process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL ?? "https://rpc.bohr.life"] } },
  blockExplorers: { default: { name: "Botchain Explorer", url: process.env.NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL ?? "" } },
  testnet: true,
});

export const explorerUrl = process.env.NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL ?? "";
