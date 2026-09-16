import { getAddress, isAddress, type Address } from "viem";

const FALLBACK_BOTVAULT_ADDRESS = "0x2bbe69cD810543FC2b819081172D74c66D44556C" as const;

const rawAddress = process.env.NEXT_PUBLIC_BOTVAULT_CONTRACT_ADDRESS?.trim();

function resolveAddress(): Address {
  if (rawAddress && isAddress(rawAddress)) {
    return getAddress(rawAddress);
  }
  return getAddress(FALLBACK_BOTVAULT_ADDRESS);
}

export const botVaultAddress: Address = resolveAddress();
export type BotVaultAddress = Address;
