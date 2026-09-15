"use client";

import Link from "next/link";
import { ArrowLeft, CalendarClock, CheckCircle2, CircleHelp } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount, useBalance, useChainId, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import AppShell from "@/components/AppShell";
import TransactionStatus from "@/components/TransactionStatus";
import { botchainTestnet } from "@/config/chain";
import { botVaultAbi } from "@/contracts/abi/BotVault";
import { botVaultAddress } from "@/contracts/addresses";

export default function CreatePage() {
  const router = useRouter();
  const { address } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [formError, setFormError] = useState("");

  // Redirect to dashboard upon successful vault creation
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, router]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setFormError("");

    if (!address) return setFormError("Connect your wallet first.");
    if (chainId !== botchainTestnet.id) return setFormError("Please switch to Botchain Testnet.");
    if (!botVaultAddress) return setFormError("Contract address is not configured.");
    if (!amount || Number(amount) <= 0) return setFormError("Deposit amount must be greater than zero.");

    const unlock = Math.floor(new Date(date).getTime() / 1000);
    if (!date || !Number.isFinite(unlock) || unlock <= Math.floor(Date.now() / 1000)) {
      return setFormError("Choose a future unlock date.");
    }

    try {
      writeContract({
        address: botVaultAddress,
        abi: botVaultAbi,
        functionName: "createVault",
        args: [BigInt(unlock)],
        value: parseEther(amount),
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Transaction could not be prepared.");
    }
  };

  return (
    <AppShell>
      <main className="mx-auto max-w-5xl px-5 pb-24 pt-12 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-white">
          <ArrowLeft size={15} />
          Back to dashboard
        </Link>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_.7fr]">
          <div>
            <p className="text-xs uppercase tracking-[.2em] text-[var(--mint)]">Start saving</p>
            <h1 className="mt-3 text-5xl font-black tracking-tight">Create a vault.</h1>
            <p className="mt-5 max-w-lg leading-7 text-[var(--muted)]">
              Choose an amount and a future date. Your funds remain in the contract until the unlock time.
            </p>

            <form onSubmit={submit} className="glass mt-10 rounded-2xl p-6">
              <label className="text-sm font-semibold">
                Deposit amount <span className="text-[var(--muted)]">/ BOT</span>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0.00"
                  className="mt-3 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-2xl outline-none focus:border-[var(--accent)]"
                />
              </label>

              <label className="mt-6 block text-sm font-semibold">
                Unlock date
                <input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  type="datetime-local"
                  className="mt-3 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-base outline-none focus:border-[var(--accent)]"
                />
              </label>

              {formError ? <p className="mt-4 text-sm text-red-200">{formError}</p> : null}

              {isSuccess && (
                <div className="mt-4 flex items-center gap-2 text-sm text-[var(--accent)]">
                  <CheckCircle2 size={16} />
                  <span>Vault created! Redirecting to dashboard...</span>
                </div>
              )}

              <button
                disabled={isPending || confirming || isSuccess}
                className="mt-7 w-full rounded-xl bg-[var(--accent)] px-5 py-4 font-bold text-[#0b1712] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending
                  ? "Waiting for confirmation..."
                  : confirming
                  ? "Confirming on-chain..."
                  : isSuccess
                  ? "Redirecting..."
                  : "Create vault"}
              </button>

              <TransactionStatus hash={hash} error={error?.message} success={isSuccess} />
            </form>
          </div>

          <aside className="self-start rounded-2xl border border-white/10 bg-white/[.03] p-6">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <CalendarClock size={17} className="text-[var(--accent)]" /> Vault summary
            </p>

            <div className="mt-8 space-y-5 text-sm">
              <Summary
                label="Wallet balance"
                value={balance ? `${Number(formatEther(balance.value)).toFixed(4)} BOT` : "Connect wallet"}
              />
              <Summary label="Deposit amount" value={amount ? `${amount} BOT` : "--"} />
              <Summary label="Unlock date" value={date ? new Date(date).toLocaleString() : "--"} />
            </div>

            <p className="mt-8 flex gap-2 text-xs leading-5 text-[var(--muted)]">
              <CircleHelp size={14} className="mt-0.5 shrink-0" /> Gas is paid separately by your wallet. Review every transaction before signing.
            </p>
          </aside>
        </div>
      </main>
    </AppShell>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/10 pb-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
