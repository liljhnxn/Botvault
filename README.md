# 🚀 BOTVAULT — Decentralized Time-Locked Savings DApp

**Lock Today. Unlock Tomorrow.**

> A decentralized time-locked savings vault built on **Botchain Testnet**.

---

## 🌟 Overview

**BotVault** is a non-custodial decentralized application deployed on **Botchain Mainnet (Chain ID 677)** that allows users to lock native `BOT` tokens in a verified Solidity smart contract until a user-chosen future timestamp.

All deposit, vault creation, status inspection, additional deposits, and withdrawals execute via real on-chain smart contract transactions using **wagmi** and **viem**.

---

## ✨ Features

- 🔒 **Non-Custodial Time Locks**: Tokens remain securely held in the smart contract until the exact on-chain timestamp is reached.
- ⚡ **Real Web3 Interactions**: Built natively on `wagmi` and `viem` with zero simulated or mock data.
- ⏱️ **Live Dynamic Countdown**: Automatic time countdown syncing with on-chain `unlockTime`.
- ➕ **Deposit More**: Vault owners can deposit additional native tokens to existing vaults prior to withdrawal.
- 📊 **Real-Time On-Chain Dashboard**: Live metrics for wallet balance, total locked tokens, active vaults, and completed vaults.
- 📜 **Activity Timeline**: Real-time event watcher capturing `VaultCreated`, `VaultDeposit`, and `VaultWithdrawn` events with direct block explorer links.
- 🛡️ **Institutional-Grade Security**: Uses OpenZeppelin `ReentrancyGuard`, checks-effects-interactions pattern, custom error reverts, zero-amount protections, and double-withdrawal prevention.

---

## 🌐 Botchain Mainnet Configuration

| Parameter | Value |
| :--- | :--- |
| **Network Name** | Botchain Mainnet |
| **Chain ID** | `677` |
| **Native Currency** | `BOT` (18 decimals) |
| **RPC Endpoint** | `https://rpc.botchain.ai` |
| **Explorer** | `https://scan.botchain.ai` |
| **Deployed BotVault Contract** | `0x555e35a9dF9adFe84353e9FC018f46060Dcd8144` |

---

## 🧱 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Web3 / Blockchain**: wagmi v3, viem v2, @tanstack/react-query v5
- **Smart Contracts**: Solidity `^0.8.24`, OpenZeppelin Contracts v5
- **Testing & Tooling**: Hardhat 3, Mocha, Chai, TypeScript, tsx

---

## 📁 Architecture

```text
botvault/
├── contracts/
│   └── BotVault.sol               # Core time-locked vault Solidity contract
├── test/
│   └── BotVault.test.ts           # Comprehensive Hardhat & Mocha tests
├── scripts/
│   └── deploy.ts                  # Botchain deployment script
├── src/
│   ├── app/
│   │   ├── page.tsx               # Landing page
│   │   ├── dashboard/page.tsx     # Dashboard & vault portfolio overview
│   │   ├── create/page.tsx        # New vault creation form
│   │   ├── vault/[id]/page.tsx    # Individual vault management & deposit more
│   │   ├── activity/page.tsx      # On-chain event activity timeline
│   │   └── layout.tsx             # Root layout & providers
│   ├── components/
│   │   ├── Navbar.tsx             # Responsive navigation with mobile menu
│   │   ├── WalletButton.tsx       # Wagmi connect / disconnect / network switch
│   │   ├── VaultCard.tsx          # Vault card component
│   │   ├── Countdown.tsx          # Real-time countdown timer
│   │   ├── TransactionStatus.tsx  # Dynamic transaction confirmation banner
│   │   └── AppShell.tsx           # Layout wrapper
│   ├── config/
│   │   ├── chain.ts               # Botchain Testnet viem chain definition
│   │   └── providers.tsx          # Wagmi & React Query provider wrapper
│   └── contracts/
│       ├── abi/
│       │   ├── BotVault.ts        # Typed TypeScript ABI
│       │   └── BotVault.json      # Standard JSON ABI
│       └── addresses.ts           # Configured contract address loader
├── hardhat.config.ts              # Hardhat configuration
├── package.json
└── README.md
```

---

## 🔐 Environment Variables

Create `.env.local` based on `.env.example`:

```env
# Frontend (Public)
NEXT_PUBLIC_BOTCHAIN_CHAIN_ID=677
NEXT_PUBLIC_BOTCHAIN_RPC_URL=https://rpc.botchain.ai
NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL=https://scan.botchain.ai
NEXT_PUBLIC_BOTVAULT_CONTRACT_ADDRESS=0x555e35a9dF9adFe84353e9FC018f46060Dcd8144

# Deployment Only (Keep private, never prefix with NEXT_PUBLIC_)
BOTCHAIN_RPC_URL=https://rpc.botchain.ai
PRIVATE_KEY=your_private_key_here
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Hardhat Tests

```bash
npm run test:contracts
```

### 3. Compile Smart Contracts

```bash
npm run compile
```

### 4. Deploy to Botchain Testnet

```bash
npm run deploy
```

Copy the deployed contract address and paste it into `NEXT_PUBLIC_BOTVAULT_CONTRACT_ADDRESS` inside `.env.local`.

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Smart Contract Test Coverage

The test suite in [test/BotVault.test.ts](file:///c:/Users/PROGRESSIVE/Documents/Isaac%20work/Work%204/test/BotVault.test.ts) validates:
- Vault creation with deposit and timestamp validation
- Rejection of 0 ETH/BOT deposits and past unlock timestamps
- Owner-only deposits and additions to existing vaults
- Rejection of non-owner deposits and post-withdrawal deposits
- Timestamp-enforced withdrawal protection (`StillLocked`)
- Accurate balance payouts and event emissions (`VaultCreated`, `VaultDeposit`, `VaultWithdrawn`)
- Prevention of double withdrawals
- Validation of `getVaultCount`, `getUserVaults`, `isUnlocked`, and `status` queries

---

## 🔮 Future BotNS Integration

BotVault is designed with compatibility in mind for **BotNS** (`.bot` decentralized domain names). EVM addresses can seamlessly resolve human-readable domains (e.g. `alice.bot`) once public resolution endpoints are configured.

---

## 📄 License

MIT
