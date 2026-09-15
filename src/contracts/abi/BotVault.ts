export const botVaultAbi = [
  { type: "function", name: "createVault", stateMutability: "payable", inputs: [{ name: "unlockTime", type: "uint256" }], outputs: [{ name: "vaultId", type: "uint256" }] },
  { type: "function", name: "deposit", stateMutability: "payable", inputs: [{ name: "vaultId", type: "uint256" }], outputs: [] },
  { type: "function", name: "withdraw", stateMutability: "nonpayable", inputs: [{ name: "vaultId", type: "uint256" }], outputs: [] },
  { type: "function", name: "getVault", stateMutability: "view", inputs: [{ name: "vaultId", type: "uint256" }], outputs: [{ name: "vault", type: "tuple", components: [{ name: "vaultId", type: "uint256" }, { name: "owner", type: "address" }, { name: "amount", type: "uint256" }, { name: "unlockTime", type: "uint256" }, { name: "createdAt", type: "uint256" }, { name: "withdrawn", type: "bool" }] }] },
  { type: "function", name: "getUserVaults", stateMutability: "view", inputs: [{ name: "user", type: "address" }], outputs: [{ name: "", type: "uint256[]" }] },
  { type: "function", name: "getVaultCount", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { type: "function", name: "isUnlocked", stateMutability: "view", inputs: [{ name: "vaultId", type: "uint256" }], outputs: [{ name: "", type: "bool" }] },
  { type: "function", name: "status", stateMutability: "view", inputs: [{ name: "vaultId", type: "uint256" }], outputs: [{ name: "", type: "uint8" }] },
  { type: "event", name: "VaultCreated", anonymous: false, inputs: [{ indexed: true, name: "vaultId", type: "uint256" }, { indexed: true, name: "owner", type: "address" }, { indexed: false, name: "amount", type: "uint256" }, { indexed: false, name: "unlockTime", type: "uint256" }] },
  { type: "event", name: "VaultDeposit", anonymous: false, inputs: [{ indexed: true, name: "vaultId", type: "uint256" }, { indexed: false, name: "amount", type: "uint256" }] },
  { type: "event", name: "VaultWithdrawn", anonymous: false, inputs: [{ indexed: true, name: "vaultId", type: "uint256" }, { indexed: true, name: "owner", type: "address" }, { indexed: false, name: "amount", type: "uint256" }] },
] as const;
