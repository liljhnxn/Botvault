import { getAddress, type Address } from "viem";

const configuredAddress = process.env.NEXT_PUBLIC_BOTVAULT_CONTRACT_ADDRESS;
export const botVaultAddress = configuredAddress ? getAddress(configuredAddress) : undefined;
export type BotVaultAddress = Address;
