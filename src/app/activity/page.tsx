"use client";

import Link from "next/link";
import { ArrowUpRight, History } from "lucide-react";
import { useAccount, useWatchContractEvent } from "wagmi";
import { useState } from "react";
import { formatEther } from "viem";
import AppShell from "@/components/AppShell";
import { botVaultAbi } from "@/contracts/abi/BotVault";
import { botVaultAddress } from "@/contracts/addresses";
import { explorerUrl } from "@/config/chain";

type EventItem = {
  name: string;
  vault: string;
  amount?: string;
  hash: `0x${string}`;
  timestamp: number;
};

export default function ActivityPage() {
  const { address } = useAccount();
  const [events, setEvents] = useState<EventItem[]>([]);

  useWatchContractEvent({
    address: botVaultAddress,
    abi: botVaultAbi,
    eventName: "VaultCreated",
    onLogs: (logs) => {
      const newItems = logs
        .filter((log) => log.args.owner?.toLowerCase() === address?.toLowerCase())
        .map((log) => ({
          name: "Vault Created",
          vault: log.args.vaultId?.toString() ?? "-",
          amount: log.args.amount ? `${Number(formatEther(log.args.amount)).toFixed(4)} BOT` : undefined,
          hash: log.transactionHash,
          timestamp: Date.now(),
        }));
      setEvents((current) => [...newItems, ...current]);
    },
    enabled: Boolean(address && botVaultAddress),
  });

  useWatchContractEvent({
    address: botVaultAddress,
    abi: botVaultAbi,
    eventName: "VaultDeposit",
    onLogs: (logs) => {
      const newItems = logs.map((log) => ({
        name: "Vault Deposit",
        vault: log.args.vaultId?.toString() ?? "-",
        amount: log.args.amount ? `${Number(formatEther(log.args.amount)).toFixed(4)} BOT` : undefined,
        hash: log.transactionHash,
        timestamp: Date.now(),
      }));
      setEvents((current) => [...newItems, ...current]);
    },
    enabled: Boolean(address && botVaultAddress),
  });

  useWatchContractEvent({
    address: botVaultAddress,
    abi: botVaultAbi,
    eventName: "VaultWithdrawn",
    onLogs: (logs) => {
      const newItems = logs
        .filter((log) => log.args.owner?.toLowerCase() === address?.toLowerCase())
        .map((log) => ({
          name: "Vault Withdrawn",
          vault: log.args.vaultId?.toString() ?? "-",
          amount: log.args.amount ? `${Number(formatEther(log.args.amount)).toFixed(4)} BOT` : undefined,
          hash: log.transactionHash,
          timestamp: Date.now(),
        }));
      setEvents((current) => [...newItems, ...current]);
    },
    enabled: Boolean(address && botVaultAddress),
  });

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-5 pb-24 pt-12 lg:px-8">
        <p className="text-xs uppercase tracking-[.2em] text-[var(--mint)]">On-chain timeline</p>
        <h1 className="mt-3 text-4xl font-black">Activity</h1>

        {!address ? (
          <Empty text="Connect your wallet to watch live contract activity." />
        ) : !events.length ? (
          <Empty text="Contract events will appear here in real-time as transactions occur." />
        ) : (
          <div className="glass mt-10 overflow-hidden rounded-2xl">
            <div className="grid grid-cols-4 border-b border-white/10 px-5 py-4 text-xs uppercase tracking-[.12em] text-[var(--muted)]">
              <span>Event</span>
              <span>Vault</span>
              <span>Amount</span>
              <span>Transaction</span>
            </div>
            {events.map((event, index) => (
              <div
                key={`${event.hash}-${index}`}
                className="grid grid-cols-4 items-center border-b border-white/10 px-5 py-5 text-sm last:border-0"
              >
                <span className="font-semibold text-white">{event.name}</span>
                <span>#{event.vault}</span>
                <span className="text-[var(--mint)]">{event.amount ?? "-"}</span>
                <span>
                  {explorerUrl ? (
                    <a
                      href={`${explorerUrl}/tx/${event.hash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[var(--accent)] hover:underline"
                    >
                      {`${event.hash.slice(0, 6)}...${event.hash.slice(-4)}`}
                      <ArrowUpRight size={14} />
                    </a>
                  ) : (
                    <span className="font-mono text-xs text-[var(--muted)]">
                      {`${event.hash.slice(0, 6)}...${event.hash.slice(-4)}`}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </AppShell>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="glass mt-10 rounded-2xl p-12 text-center">
      <History className="mx-auto text-[var(--accent)]" size={25} />
      <p className="mt-4 text-sm text-[var(--muted)]">{text}</p>
      <Link href="/create" className="mt-6 inline-block text-sm text-[var(--accent)] hover:underline">
        Create a vault
      </Link>
    </div>
  );
}
