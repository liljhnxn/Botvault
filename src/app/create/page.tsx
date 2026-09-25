"use client";

import Link from "next/link";
import { ArrowLeft, CalendarClock, CheckCircle2, CircleHelp } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount, useBalance, useChainId, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import AppShell from "@/components/AppShell";
import TransactionStatus from "@/components/TransactionStatus";
import { botchain } from "@/config/chain";
import { botVaultAbi } from "@/contracts/abi/BotVault";
import { botVaultAddress } from "@/contracts/addresses";

export default function CreatePage() {
  const router = useRouter();
  const { address } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address, chainId: botchain.id });
  const { writeContract, data: hash, error: writeError, isPending, reset: resetWrite } = useWriteContract();
  const {
    isLoading: confirming,
    isSuccess,
    data: receipt,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash, chainId: botchain.id });

  const isReverted = receipt?.status === "reverted";

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [formError, setFormError] = useState("");

  const balanceNumber = balance ? Number(formatEther(balance.value)) : 0;
  const ESTIMATED_GAS_FEE = 0.005; // 206k gas * 20 Gwei = ~0.00414 BOT
  const maxSafeDeposit = Math.max(0, balanceNumber - ESTIMATED_GAS_FEE);

  const minDateTime = useMemo(() => {
    const d = new Date(Date.now() + 5 * 60 * 1000);
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
  }, []);

  const setPresetDate = (hours: number) => {
    const d = new Date(Date.now() + hours * 3600 * 1000);
    const tzOffset = d.getTimezoneOffset() * 60000;
    setDate(new Date(d.getTime() - tzOffset).toISOString().slice(0, 16));
    setFormError("");
  };

  // Redirect to dashboard upon successful vault creation
  useEffect(() => {
    if (isSuccess && !isReverted) {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, isReverted, router]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setFormError("");

    if (!address) return setFormError("Connect your wallet first.");
    if (chainId !== botchain.id) return setFormError("Please switch to Botchain Mainnet.");
    if (!botVaultAddress) return setFormError("Contract address is not configured.");
    if (!amount || Number(amount) <= 0) return setFormError("Deposit amount must be greater than zero.");

    const parsedAmount = Number(amount);
    if (balance) {
      if (parsedAmount > balanceNumber) {
        return setFormError(`Deposit exceeds your total wallet balance (${balanceNumber.toFixed(4)} BOT).`);
      }
      if (parsedAmount + ESTIMATED_GAS_FEE > balanceNumber) {
        return setFormError(
          `You need ~0.0042–0.005 BOT left in your wallet for network gas fees. The maximum safe deposit with your balance is ${maxSafeDeposit.toFixed(4)} BOT.`
        );
      }
    }

    const unlock = Math.floor(new Date(date).getTime() / 1000);
    const now = Math.floor(Date.now() / 1000);
    if (!date || !Number.isFinite(unlock) || unlock <= now + 120) {
      return setFormError("Unlock date must be at least 2 minutes in the future to allow for on-chain block mining.");
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
              <div>
                <div className="flex items-center justify-between text-sm font-semibold">
                  <label htmlFor="deposit-amount-input">
                    Deposit amount <span className="text-[var(--muted)]">/ BOT</span>
                  </label>
                  {balance && (
                    <button
                      type="button"
                      onClick={() => {
                        setAmount(maxSafeDeposit > 0 ? maxSafeDeposit.toFixed(4) : "0");
                        setFormError("");
                      }}
                      className="text-xs font-normal text-[var(--accent)] hover:underline"
                    >
                      Safe Max: {maxSafeDeposit.toFixed(4)} BOT
                    </button>
                  )}
                </div>
                <input
                  id="deposit-amount-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0.00"
                  className="mt-3 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-2xl outline-none focus:border-[var(--accent)]"
                />
                <p className="mt-2 text-xs text-[var(--muted)]">
                  Wallet balance: {balanceNumber.toFixed(4)} BOT (~0.005 BOT reserved for gas)
                </p>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <label htmlFor="unlock-date-input">Unlock date</label>
                  <span className="text-xs text-[var(--muted)]">Min. 5 minutes in future</span>
                </div>
                <input
                  id="unlock-date-input"
                  value={date}
                  min={minDateTime}
                  onChange={(e) => setDate(e.target.value)}
                  type="datetime-local"
                  className="mt-3 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-base outline-none focus:border-[var(--accent)]"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setPresetDate(1)}
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-[var(--muted)] hover:border-[var(--accent)] hover:text-white"
                  >
                    +1 Hour
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetDate(24)}
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-[var(--muted)] hover:border-[var(--accent)] hover:text-white"
                  >
                    +1 Day
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetDate(24 * 7)}
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-[var(--muted)] hover:border-[var(--accent)] hover:text-white"
                  >
                    +1 Week
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetDate(24 * 30)}
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-[var(--muted)] hover:border-[var(--accent)] hover:text-white"
                  >
                    +1 Month
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetDate(24 * 365)}
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-[var(--muted)] hover:border-[var(--accent)] hover:text-white"
                  >
                    +1 Year
                  </button>
                </div>
              </div>

              {formError ? <p className="mt-4 text-sm text-red-200">{formError}</p> : null}

              {isSuccess && !isReverted && (
                <div className="mt-4 flex items-center gap-2 text-sm text-[var(--accent)]">
                  <CheckCircle2 size={16} />
                  <span>Vault created! Redirecting to dashboard...</span>
                </div>
              )}

              <button
                disabled={isPending || confirming || (isSuccess && !isReverted)}
                className="mt-7 w-full rounded-xl bg-[var(--accent)] px-5 py-4 font-bold text-[#0b1712] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending
                  ? "Waiting for wallet..."
                  : confirming
                  ? "Confirming on-chain..."
                  : isReverted
                  ? "Reverted (Try with future date)"
                  : isSuccess
                  ? "Redirecting..."
                  : "Create vault"}
              </button>

              {confirming && (
                <div className="mt-3 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      resetWrite();
                      setFormError("");
                    }}
                    className="text-xs text-[var(--muted)] hover:text-white underline"
                  >
                    Taking too long? Reset status & retry
                  </button>
                </div>
              )}

              <TransactionStatus
                hash={hash}
                error={writeError?.message || receiptError?.message}
                success={isSuccess && !isReverted}
                reverted={isReverted}
              />
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
