"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Coins, LockKeyhole, PlusCircle, X } from "lucide-react";
import { useParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount, useBalance, useChainId, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import AppShell from "@/components/AppShell";
import Countdown from "@/components/Countdown";
import TransactionStatus from "@/components/TransactionStatus";
import { botchainTestnet } from "@/config/chain";
import { botVaultAbi } from "@/contracts/abi/BotVault";
import { botVaultAddress } from "@/contracts/addresses";
import { shortAddress } from "@/components/WalletButton";

export default function VaultDetail() {
  const { id } = useParams<{ id: string }>();
  const vaultId = BigInt(id);
  const { address } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address, chainId: botchainTestnet.id });

  const { data: vault, refetch } = useReadContract({
    chainId: botchainTestnet.id,
    address: botVaultAddress,
    abi: botVaultAbi,
    functionName: "getVault",
    args: [vaultId],
    query: { enabled: Boolean(botVaultAddress) },
  });

  const { writeContract: withdrawCall, data: withdrawHash, error: withdrawError, isPending: isWithdrawPending } = useWriteContract();
  const { isLoading: isWithdrawConfirming, isSuccess: isWithdrawSuccess } = useWaitForTransactionReceipt({
    hash: withdrawHash,
  });

  const { writeContract: depositCall, data: depositHash, error: depositError, isPending: isDepositPending } = useWriteContract();
  const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({
    hash: depositHash,
  });

  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositFormError, setDepositFormError] = useState("");

  if (!vault) {
    return (
      <AppShell>
        <main className="mx-auto max-w-4xl px-5 py-20">
          <p className="text-[var(--muted)]">Loading vault or contract not configured.</p>
        </main>
      </AppShell>
    );
  }

  const now = BigInt(Math.floor(Date.now() / 1000));
  const unlocked = !vault.withdrawn && vault.unlockTime <= now;
  const owner = address && vault.owner ? address.toLowerCase() === vault.owner.toLowerCase() : false;

  const handleDepositMore = (e: FormEvent) => {
    e.preventDefault();
    setDepositFormError("");

    if (!address) return setDepositFormError("Connect your wallet first.");
    if (chainId !== botchainTestnet.id) return setDepositFormError("Please switch to Botchain Mainnet.");
    if (!botVaultAddress) return setDepositFormError("Contract address not configured.");
    if (!depositAmount || Number(depositAmount) <= 0) return setDepositFormError("Please enter a valid deposit amount.");

    try {
      depositCall(
        {
          address: botVaultAddress,
          abi: botVaultAbi,
          functionName: "deposit",
          args: [vaultId],
          value: parseEther(depositAmount),
        },
        {
          onSuccess: () => {
            setDepositAmount("");
            setTimeout(() => refetch(), 1500);
          },
        }
      );
    } catch (err) {
      setDepositFormError(err instanceof Error ? err.message : "Transaction could not be initiated.");
    }
  };

  const handleWithdraw = () => {
    if (!botVaultAddress) return;
    withdrawCall(
      {
        address: botVaultAddress,
        abi: botVaultAbi,
        functionName: "withdraw",
        args: [vaultId],
      },
      {
        onSuccess: () => {
          setTimeout(() => refetch(), 1500);
        },
      }
    );
  };

  return (
    <AppShell>
      <main className="mx-auto max-w-4xl px-5 pb-24 pt-12 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-white">
          <ArrowLeft size={15} />
          Back to dashboard
        </Link>

        <div className="mt-12 flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[.2em] text-[var(--mint)]">Savings vault</p>
            <h1 className="mt-3 text-5xl font-black">Vault #{id}</h1>
          </div>
          <span className="rounded-full bg-white/5 px-4 py-2 text-sm text-[var(--accent)]">
            {vault.withdrawn ? "Withdrawn" : unlocked ? "Ready to withdraw" : "Locked"}
          </span>
        </div>

        <div className="glass mt-10 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm text-[var(--muted)]">Locked balance</p>
              <p className="mt-2 text-5xl font-black">
                {Number(formatEther(vault.amount)).toFixed(4)} <span className="text-xl text-[var(--muted)]">BOT</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[var(--muted)]">Countdown</p>
              <p className="mt-2 text-lg text-[var(--mint)]">
                {vault.withdrawn ? "Complete" : <Countdown unlockTime={vault.unlockTime} />}
              </p>
            </div>
          </div>

          <div className="mt-10 h-2 rounded-full bg-white/10">
            <div className={`h-full rounded-full ${unlocked || vault.withdrawn ? "w-full" : "w-2/3"} bg-[var(--accent)]`} />
          </div>

          <div className="mt-3 flex justify-between text-xs text-[var(--muted)]">
            <span>Created {new Date(Number(vault.createdAt) * 1000).toLocaleDateString()}</span>
            <span>Unlock {new Date(Number(vault.unlockTime) * 1000).toLocaleDateString()}</span>
          </div>

          <div className="mt-10 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-2">
            <Info label="Owner" value={shortAddress(vault.owner)} />
            <Info label="Vault status" value={vault.withdrawn ? "Funds withdrawn" : unlocked ? "Unlocked" : "Locked"} />
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            {owner && !vault.withdrawn && (
              <button
                type="button"
                onClick={() => setDepositModalOpen(true)}
                className="flex items-center justify-center gap-2 rounded-xl border border-[var(--accent)] px-5 py-4 font-bold text-[var(--accent)] hover:bg-[var(--accent)]/10"
              >
                <PlusCircle size={17} />
                Deposit More
              </button>
            )}

            {owner && unlocked && !vault.withdrawn && (
              <button
                type="button"
                disabled={isWithdrawPending || isWithdrawConfirming}
                onClick={handleWithdraw}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-4 font-bold text-[#0b1712] disabled:opacity-50"
              >
                <Coins size={17} />
                {isWithdrawPending ? "Confirm in wallet..." : isWithdrawConfirming ? "Confirming..." : "Withdraw funds"}
              </button>
            )}
          </div>

          <TransactionStatus hash={withdrawHash} error={withdrawError?.message} success={isWithdrawSuccess} />
        </div>

        {/* Deposit More Modal */}
        {depositModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="glass w-full max-w-md rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-bold">Deposit More Funds</h3>
                <button
                  onClick={() => setDepositModalOpen(false)}
                  className="rounded-lg p-1 text-[var(--muted)] hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleDepositMore} className="mt-6 space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-[var(--muted)]">
                    Amount (BOT)
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-lg outline-none focus:border-[var(--accent)]"
                  />
                  <p className="mt-2 text-xs text-[var(--muted)]">
                    Wallet Balance: {balance ? `${Number(formatEther(balance.value)).toFixed(4)} BOT` : "--"}
                  </p>
                </div>

                {depositFormError && <p className="text-xs text-red-300">{depositFormError}</p>}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isDepositPending || isDepositConfirming}
                    className="w-full rounded-xl bg-[var(--accent)] py-3 font-bold text-[#0b1712] disabled:opacity-50"
                  >
                    {isDepositPending ? "Confirm in wallet..." : isDepositConfirming ? "Confirming..." : "Deposit"}
                  </button>
                </div>

                <TransactionStatus hash={depositHash} error={depositError?.message} success={isDepositSuccess} />
              </form>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-2 text-xs text-[var(--muted)]">
          <LockKeyhole size={14} /> Only the vault owner can withdraw after the on-chain unlock time. <ArrowUpRight size={13} />
        </div>
      </main>
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-sm">{value}</p>
    </div>
  );
}
