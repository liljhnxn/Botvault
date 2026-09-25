"use client";

import Link from "next/link";
import { Plus, RefreshCw } from "lucide-react";
import { useAccount, useBalance, useChainId, useReadContract, useReadContracts, useSwitchChain } from "wagmi";
import { formatEther } from "viem";
import AppShell from "@/components/AppShell";
import VaultCard from "@/components/VaultCard";
import { botVaultAbi } from "@/contracts/abi/BotVault";
import { botVaultAddress } from "@/contracts/addresses";
import { botchain } from "@/config/chain";

export type Vault = {
  vaultId: bigint;
  owner: `0x${string}`;
  amount: bigint;
  unlockTime: bigint;
  createdAt: bigint;
  withdrawn: boolean;
};

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const isWrongNetwork = isConnected && chainId !== botchain.id;

  const { data: balance } = useBalance({ address, chainId: botchain.id });

  const {
    data: ids,
    isLoading: isIdsLoading,
    refetch: refetchIds,
  } = useReadContract({
    chainId: botchain.id,
    address: botVaultAddress,
    abi: botVaultAbi,
    functionName: "getUserVaults",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address && botVaultAddress) },
  });

  const vaultContracts = (ids ?? []).map((id) => ({
    chainId: botchain.id,
    address: botVaultAddress,
    abi: botVaultAbi,
    functionName: "getVault" as const,
    args: [id] as const,
  }));

  const {
    data: vaultsData,
    isLoading: isVaultsLoading,
    refetch: refetchVaults,
  } = useReadContracts({
    contracts: vaultContracts,
    query: { enabled: Boolean(vaultContracts.length > 0) },
  });

  const vaults: Vault[] = (vaultsData ?? [])
    .map((result) => result.result as Vault | undefined)
    .filter((vault): vault is Vault => Boolean(vault && vault.vaultId !== undefined));

  const totalLockedWei = vaults.reduce((acc, vault) => {
    if (!vault.withdrawn) {
      return acc + vault.amount;
    }
    return acc;
  }, BigInt(0));

  const activeCount = vaults.filter((v) => !v.withdrawn).length;
  const completedCount = vaults.filter((v) => v.withdrawn).length;

  const handleRefresh = () => {
    refetchIds();
    refetchVaults();
  };

  const isLoading = isIdsLoading || (Boolean(ids?.length) && isVaultsLoading);

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-5 pb-24 pt-12 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[.2em] text-[var(--mint)]">Your savings workspace</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight">Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="rounded-full border border-white/10 p-3 text-[var(--muted)] hover:text-white"
              aria-label="Refresh vaults"
            >
              <RefreshCw size={17} />
            </button>
            <Link
              href="/create"
              className="flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-bold text-[#0b1712]"
            >
              <Plus size={16} />
              New vault
            </Link>
          </div>
        </div>

        {isWrongNetwork && (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5 text-amber-200">
            <div>
              <p className="font-bold text-white">Wrong Network Detected</p>
              <p className="mt-1 text-sm text-amber-200/80">
                Your wallet is connected to a different network. Switch to Botchain Mainnet (Chain ID 677) to see your vaults.
              </p>
            </div>
            <button
              onClick={() => switchChain({ chainId: botchain.id })}
              className="rounded-full bg-amber-400 px-5 py-2.5 text-xs font-bold text-black transition hover:bg-amber-300"
            >
              Switch to Botchain Mainnet
            </button>
          </div>
        )}

        {!isConnected ? (
          <div className="glass mt-10 rounded-2xl p-10 text-center">
            <h2 className="text-xl font-semibold">Connect your wallet to view vaults.</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Your vault history is read directly from Botchain.</p>
          </div>
        ) : !botVaultAddress ? (
          <div className="glass mt-10 rounded-2xl p-10 text-center">
            <h2 className="text-xl font-semibold">Contract address not configured.</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Deploy BotVault and add NEXT_PUBLIC_BOTVAULT_CONTRACT_ADDRESS to .env.local.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Stat
                label="Wallet balance"
                value={balance ? `${Number(formatEther(balance.value)).toFixed(4)} BOT` : "--"}
              />
              <Stat
                label="Total locked"
                value={isLoading ? "Loading..." : `${Number(formatEther(totalLockedWei)).toFixed(4)} BOT`}
              />
              <Stat
                label="Active vaults"
                value={isLoading ? "Loading..." : String(activeCount)}
              />
              <Stat
                label="Completed"
                value={isLoading ? "Loading..." : String(completedCount)}
              />
            </div>

            <div className="mt-14">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Your vaults</h2>
                <span className="text-sm text-[var(--muted)]">
                  {isLoading ? "Loading..." : `${vaults.length} total`}
                </span>
              </div>

              {isLoading && !vaults.length ? (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="glass h-56 animate-pulse rounded-2xl" />
                  <div className="glass h-56 animate-pulse rounded-2xl" />
                </div>
              ) : vaults.length ? (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {vaults.map((vault) => (
                    <VaultCard key={vault.vaultId.toString()} vault={vault} />
                  ))}
                </div>
              ) : (
                <div className="glass mt-5 rounded-2xl p-10 text-center">
                  <h3 className="text-lg font-semibold">No vaults yet.</h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">Create your first savings vault.</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-xs uppercase tracking-[.12em] text-[var(--muted)]">{label}</p>
      <p className="mt-4 text-xl font-bold">{value}</p>
    </div>
  );
}
