import { getAddress, type Address } from "viem";

const FALLBACK_BOTVAULT_ADDRESS = "0x2bbe69cD810543FC2b819081172D74c66D44556C";
const configuredAddress =
  process.env.NEXT_PUBLIC_BOTVAULT_CONTRACT_ADDRESS || FALLBACK_BOTVAULT_ADDRESS;
export const botVaultAddress = configuredAddress ? getAddress(configuredAddress) : undefined;
export type BotVaultAddress = Address;
