"use client";

import Link from "next/link";
import { ArrowUpRight, ExternalLink, Menu, Vault, X } from "lucide-react";
import { useState } from "react";
import WalletButton from "./WalletButton";
import { explorerUrl } from "@/config/chain";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="mx-auto w-full max-w-7xl px-5 py-5 lg:px-8">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-[var(--accent)] text-[#0b1712]">
            <Vault size={19} />
          </span>
          <span className="text-sm font-black tracking-[0.18em]">BOTVAULT</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-[var(--muted)] md:flex">
          <Link href="/dashboard" className="transition hover:text-white">
            Dashboard
          </Link>
          <Link href="/activity" className="transition hover:text-white">
            Activity
          </Link>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 transition hover:text-white"
          >
            <span>Explorer</span>
            <ExternalLink size={12} className="opacity-70" />
          </a>
          <Link href="/whitepaper" className="transition hover:text-white">
            Whitepaper
          </Link>
          <Link href="/create" className="flex items-center gap-1 text-white hover:text-[var(--accent)]">
            Create <ArrowUpRight size={14} />
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Botchain Mainnet Explorer (Chain 677)"
            className="hidden lg:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[var(--muted)] hover:border-[var(--accent)]/30 hover:text-white transition"
          >
            <span className="size-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
            <span>Mainnet 677</span>
            <ArrowUpRight size={11} className="opacity-60" />
          </a>
          <WalletButton />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-[var(--muted)] hover:text-white md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="glass mt-3 flex flex-col gap-4 rounded-xl p-4 text-sm md:hidden">
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[var(--muted)] hover:text-white"
          >
            Dashboard
          </Link>
          <Link
            href="/activity"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[var(--muted)] hover:text-white"
          >
            Activity
          </Link>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-1.5 text-[var(--muted)] hover:text-white"
          >
            <span>Botchain Explorer</span>
            <ExternalLink size={13} />
          </a>
          <Link
            href="/whitepaper"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[var(--muted)] hover:text-white"
          >
            Whitepaper
          </Link>
          <Link
            href="/create"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-1 font-semibold text-[var(--accent)]"
          >
            Create Vault <ArrowUpRight size={14} />
          </Link>
        </nav>
      )}
    </header>
  );
}

