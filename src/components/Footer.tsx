import Link from "next/link";
import { ArrowUpRight, ExternalLink, ShieldCheck, Vault } from "lucide-react";
import { explorerUrl } from "@/config/chain";
import { botVaultAddress } from "@/contracts/addresses";

function formatAddress(address?: string) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#06100d]/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-xl bg-[var(--accent)] text-[#0b1712]">
                <Vault size={18} />
              </span>
              <span className="text-sm font-black tracking-[0.18em]">BOTVAULT</span>
            </Link>
            <p className="text-xs leading-relaxed text-[var(--muted)]">
              Decentralized, non-custodial time-locked savings protocol deployed on Botchain Mainnet.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
              <span className="size-2 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />
              Botchain Mainnet (Chain 677)
            </div>
          </div>

          {/* Protocol Links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--mint)]">Protocol</p>
            <ul className="mt-4 space-y-2.5 text-xs text-[var(--muted)]">
              <li>
                <Link href="/dashboard" className="transition hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/create" className="transition hover:text-white">
                  Create Vault
                </Link>
              </li>
              <li>
                <Link href="/activity" className="transition hover:text-white">
                  On-chain Activity
                </Link>
              </li>
              <li>
                <Link href="/whitepaper" className="transition hover:text-white">
                  Documentation & Whitepaper
                </Link>
              </li>
            </ul>
          </div>

          {/* Blockchain & Explorer */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--mint)]">Explorer & Network</p>
            <ul className="mt-4 space-y-2.5 text-xs text-[var(--muted)]">
              <li>
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[var(--accent)] hover:underline"
                >
                  <span>Botchain Mainnet Explorer</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href={`${explorerUrl}/address/${botVaultAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-white transition"
                >
                  <span>Verified Contract ({formatAddress(botVaultAddress)})</span>
                  <ArrowUpRight size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://rpc.botchain.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-white transition"
                >
                  <span>RPC: rpc.botchain.ai</span>
                  <ArrowUpRight size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Community & Verification */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--mint)]">Transparency</p>
            <div className="mt-4 space-y-3 text-xs text-[var(--muted)]">
              <div className="flex items-start gap-2">
                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                <span>Audited logic with OpenZeppelin ReentrancyGuard & non-custodial custody.</span>
              </div>
              <div>
                <a
                  href="https://github.com/liljhnxn/Botvault"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline"
                >
                  <span>GitHub Repository</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-6 text-xs text-[var(--muted)]">
          <p>© {new Date().getFullYear()} BotVault Protocol. All smart contract actions are immutable and verifiable on-chain.</p>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-white transition"
          >
            <span>scan.botchain.ai</span>
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </footer>
  );
}
