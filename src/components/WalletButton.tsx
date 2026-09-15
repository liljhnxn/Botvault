"use client";

import { LogOut, Wallet, Wifi } from "lucide-react";
import { formatEther } from "viem";
import { useAccount, useBalance, useChainId, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { botchainTestnet } from "@/config/chain";

export function shortAddress(address?: string) { return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""; }

export default function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  const wrongNetwork = isConnected && chainId !== botchainTestnet.id;

  if (!isConnected) return <button onClick={() => connect({ connector: connectors[0] })} className="flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-bold text-[#0b1712] transition hover:brightness-110" disabled={isPending}><Wallet size={16} />{isPending ? "Connecting..." : "Connect wallet"}</button>;
  return <div className="flex items-center gap-2">
    {wrongNetwork ? <button onClick={() => switchChain({ chainId: botchainTestnet.id })} className="hidden items-center gap-2 rounded-full border border-amber-300/30 bg-amber-200/10 px-3 py-2 text-xs text-amber-200 sm:flex"><Wifi size={14} />Switch network</button> : null}
    <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-[var(--muted)] sm:block">{balance ? `${Number(formatEther(balance.value)).toFixed(3)} BOT` : "-- BOT"}</div>
    <button onClick={() => address && navigator.clipboard?.writeText(address)} aria-label="Copy wallet address" className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10">{shortAddress(address)}</button>
    <button onClick={() => disconnect()} aria-label="Disconnect wallet" className="rounded-full border border-white/10 p-2 text-[var(--muted)] hover:text-white"><LogOut size={16} /></button>
  </div>;
}
