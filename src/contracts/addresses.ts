import { getAddress, isAddress, type Address } from "viem";

const FALLBACK_BOTVAULT_ADDRESS = "0x555e35a9dF9adFe84353e9FC018f46060Dcd8144" as const;

const rawAddress = process.env.NEXT_PUBLIC_BOTVAULT_CONTRACT_ADDRESS?.trim();

function resolveAddress(): Address {
  if (rawAddress && isAddress(rawAddress)) {
    return getAddress(rawAddress);
  }
  return getAddress(FALLBACK_BOTVAULT_ADDRESS);
}

export const botVaultAddress: Address = resolveAddress();
export type BotVaultAddress = Address;
