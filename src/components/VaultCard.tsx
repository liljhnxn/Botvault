"use client";

/* eslint-disable react-hooks/purity */

import Link from "next/link";
import { ArrowUpRight, LockKeyhole, UnlockKeyhole } from "lucide-react";
import { formatEther } from "viem";
import Countdown from "./Countdown";
import { shortAddress } from "./WalletButton";

type Vault = { vaultId: bigint; owner: `0x${string}`; amount: bigint; unlockTime: bigint; createdAt: bigint; withdrawn: boolean };
export default function VaultCard({ vault }: { vault: Vault }) { const unlocked = !vault.withdrawn && vault.unlockTime <= BigInt(Math.floor(Date.now() / 1000)); return <Link href={`/vault/${vault.vaultId}`} className="glass group block rounded-2xl p-5 transition hover:-translate-y-1 hover:border-[rgba(186,255,105,.35)]"><div className="flex items-start justify-between"><div><p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Vault #{vault.vaultId.toString()}</p><p className="mt-3 text-2xl font-semibold">{Number(formatEther(vault.amount)).toFixed(4)} <span className="text-sm text-[var(--muted)]">BOT</span></p></div><span className={`rounded-full px-3 py-1 text-xs ${vault.withdrawn ? "bg-white/10 text-[var(--muted)]" : unlocked ? "bg-[rgba(186,255,105,.12)] text-[var(--accent)]" : "bg-white/5 text-[var(--muted)]"}`}>{vault.withdrawn ? "Withdrawn" : unlocked ? <><UnlockKeyhole className="mr-1 inline" size={13} />Unlocked</> : <><LockKeyhole className="mr-1 inline" size={13} />Locked</>}</span></div><div className="mt-7 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-sm"><div><p className="text-xs text-[var(--muted)]">Unlock date</p><p className="mt-1">{new Date(Number(vault.unlockTime) * 1000).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</p></div><div><p className="text-xs text-[var(--muted)]">Countdown</p><p className="mt-1 text-[var(--mint)]"><Countdown unlockTime={vault.unlockTime} /></p></div></div><div className="mt-5 flex items-center justify-between text-xs text-[var(--muted)]"><span>Owner {shortAddress(vault.owner)}</span><ArrowUpRight size={15} className="transition group-hover:text-[var(--accent)]" /></div></Link>; }
