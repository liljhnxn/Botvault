"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Printer, Download, ExternalLink, ShieldCheck, Lock, Layers } from "lucide-react";

export default function WhitepaperPage() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500 selection:text-black">
      {/* Top Action Bar (hidden when printing) */}
      <div className="max-w-4xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to BotVault
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Save as PDF / Print
          </button>
        </div>
      </div>

      {/* Main Document Container */}
      <article className="max-w-4xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-12 shadow-2xl backdrop-blur-sm print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        
        {/* Header */}
        <header className="border-b border-slate-800 pb-8 mb-10 print:border-slate-300">
          <div className="flex items-center gap-3 text-emerald-400 font-mono text-sm font-semibold tracking-wider uppercase mb-3 print:text-emerald-700">
            <Lock className="w-4 h-4" /> BotVault Official Documentation
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3 print:text-black">
            BotVault — Whitepaper & Pitch Deck
          </h1>
          <p className="text-lg text-slate-400 print:text-slate-700">
            Non-Custodial Time-Locked Savings & Capital Preservation Protocol on Botchain.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs font-mono text-slate-400 print:text-slate-600">
            <span>Network: <strong>Botchain Mainnet (Chain ID 677)</strong></span>
            <span>•</span>
            <span>Contract: <strong>0x555e35a9dF9adFe84353e9FC018f46060Dcd8144</strong></span>
          </div>
        </header>

        {/* SECTION 1: PITCH DECK */}
        <section className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6 print:text-emerald-800">
            PART 1: PITCH DECK (10-SLIDE OVERVIEW)
          </div>

          <div className="space-y-6">
            {/* Slide 1 */}
            <div className="border border-slate-800/80 rounded-xl p-5 bg-slate-950/40 print:border-slate-200 print:bg-slate-50">
              <span className="text-xs font-mono text-emerald-400 font-semibold uppercase">Slide 1</span>
              <h3 className="text-lg font-bold text-white mt-1 mb-2 print:text-black">Title & Tagline</h3>
              <p className="text-sm text-slate-300 print:text-slate-800">
                <strong>BotVault: Lock Today. Unlock Tomorrow.</strong><br />
                Autonomous time-locked savings and forced financial discipline protocol built natively on Botchain.
              </p>
            </div>

            {/* Slide 2 */}
            <div className="border border-slate-800/80 rounded-xl p-5 bg-slate-950/40 print:border-slate-200 print:bg-slate-50">
              <span className="text-xs font-mono text-emerald-400 font-semibold uppercase">Slide 2</span>
              <h3 className="text-lg font-bold text-white mt-1 mb-2 print:text-black">The Problem</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 print:text-slate-800">
                <li><strong>Impulse Selling:</strong> Crypto holders struggle with paper hands and emotional churn during market fluctuations.</li>
                <li><strong>Custodial Counterparty Risk:</strong> Traditional centralized locking introduces re-hypothecation and platform default risks.</li>
                <li><strong>Lack of Savings Primitives:</strong> Botchain requires fundamental DeFi building blocks that empower long-term token holding.</li>
              </ul>
            </div>

            {/* Slide 3 */}
            <div className="border border-slate-800/80 rounded-xl p-5 bg-slate-950/40 print:border-slate-200 print:bg-slate-50">
              <span className="text-xs font-mono text-emerald-400 font-semibold uppercase">Slide 3</span>
              <h3 className="text-lg font-bold text-white mt-1 mb-2 print:text-black">The Solution</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 print:text-slate-800">
                <li><strong>Non-Custodial Time-Locks:</strong> Smart contracts deterministically lock native BOT tokens until a target on-chain timestamp.</li>
                <li><strong>Immutable Security:</strong> Zero backdoors. Code is law—funds cannot be withdrawn prematurely by anyone.</li>
                <li><strong>Top-Up Flexibility:</strong> Add additional native BOT to active vaults without postponing maturity dates.</li>
              </ul>
            </div>

            {/* Slide 4 */}
            <div className="border border-slate-800/80 rounded-xl p-5 bg-slate-950/40 print:border-slate-200 print:bg-slate-50">
              <span className="text-xs font-mono text-emerald-400 font-semibold uppercase">Slide 4</span>
              <h3 className="text-lg font-bold text-white mt-1 mb-2 print:text-black">Market Opportunity & Use Cases</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 print:text-slate-800">
                <li><strong>Personal Forced Savings:</strong> High-conviction investors holding native BOT through market cycles.</li>
                <li><strong>Founder & Advisory Cliff Vesting:</strong> Autonomous cliff release schedules without expensive enterprise contracts.</li>
                <li><strong>Community Loyalty Programs:</strong> Transparent proof of holding for ecosystem participants.</li>
              </ul>
            </div>

            {/* Slide 5 */}
            <div className="border border-slate-800/80 rounded-xl p-5 bg-slate-950/40 print:border-slate-200 print:bg-slate-50">
              <span className="text-xs font-mono text-emerald-400 font-semibold uppercase">Slide 5</span>
              <h3 className="text-lg font-bold text-white mt-1 mb-2 print:text-black">Core Product Features</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 print:text-slate-800">
                <li>One-click vault deployment with custom unlock timestamps.</li>
                <li>Real-time dynamic countdown timers synced to on-chain block timestamps.</li>
                <li>Comprehensive portfolio dashboard (Locked Value, Active Vaults, Completed Vaults).</li>
                <li>Live on-chain event activity stream directly linked to Botchain Explorer.</li>
              </ul>
            </div>

            {/* Slide 6 */}
            <div className="border border-slate-800/80 rounded-xl p-5 bg-slate-950/40 print:border-slate-200 print:bg-slate-50">
              <span className="text-xs font-mono text-emerald-400 font-semibold uppercase">Slide 6</span>
              <h3 className="text-lg font-bold text-white mt-1 mb-2 print:text-black">Security Architecture</h3>
              <p className="text-sm text-slate-300 print:text-slate-800 mb-2">
                Built on Solidity 0.8.24 with OpenZeppelin ReentrancyGuard, Checks-Effects-Interactions (CEI) design pattern, and custom revert errors to maximize gas efficiency and guarantee zero vulnerability to reentrancy or state mismatch.
              </p>
            </div>

            {/* Slide 7 */}
            <div className="border border-slate-800/80 rounded-xl p-5 bg-slate-950/40 print:border-slate-200 print:bg-slate-50">
              <span className="text-xs font-mono text-emerald-400 font-semibold uppercase">Slide 7</span>
              <h3 className="text-lg font-bold text-white mt-1 mb-2 print:text-black">Tokenomics & Ecosystem Impact</h3>
              <p className="text-sm text-slate-300 print:text-slate-800">
                BotVault creates an on-chain supply sink for native BOT. By absorbing circulating supply into deterministic time-locks, it lowers liquid velocity and stabilizes the token ecosystem.
              </p>
            </div>

            {/* Slide 8 */}
            <div className="border border-slate-800/80 rounded-xl p-5 bg-slate-950/40 print:border-slate-200 print:bg-slate-50">
              <span className="text-xs font-mono text-emerald-400 font-semibold uppercase">Slide 8</span>
              <h3 className="text-lg font-bold text-white mt-1 mb-2 print:text-black">Technology Stack</h3>
              <p className="text-sm text-slate-300 print:text-slate-800">
                Solidity 0.8.24, OpenZeppelin v5, Hardhat, Next.js 16 (Turbopack), React 19, TypeScript, Tailwind CSS v4, Viem v2, Wagmi v3, Botchain RPC.
              </p>
            </div>

            {/* Slide 9 */}
            <div className="border border-slate-800/80 rounded-xl p-5 bg-slate-950/40 print:border-slate-200 print:bg-slate-50">
              <span className="text-xs font-mono text-emerald-400 font-semibold uppercase">Slide 9</span>
              <h3 className="text-lg font-bold text-white mt-1 mb-2 print:text-black">Roadmap</h3>
              <p className="text-sm text-slate-300 print:text-slate-800">
                <strong>Phase 1:</strong> Architecture & Protocol Engine (Completed) • <strong>Phase 2:</strong> Mainnet Deployment & Live Stream (Current) • <strong>Phase 3:</strong> BotNS (.bot) Domain Resolution & Multi-Token Vaults • <strong>Phase 4:</strong> Institutional Yield & Automated Stashing.
              </p>
            </div>

            {/* Slide 10 */}
            <div className="border border-slate-800/80 rounded-xl p-5 bg-slate-950/40 print:border-slate-200 print:bg-slate-50">
              <span className="text-xs font-mono text-emerald-400 font-semibold uppercase">Slide 10</span>
              <h3 className="text-lg font-bold text-white mt-1 mb-2 print:text-black">Official Resources & Verification</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 print:text-slate-800 font-mono text-xs">
                <li>Explorer: https://scan.botchain.ai/address/0x555e35a9dF9adFe84353e9FC018f46060Dcd8144</li>
                <li>GitHub: https://github.com/liljhnxn/Botvault</li>
                <li>Network RPC: https://rpc.botchain.ai</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 2: LITEPAPER / WHITEPAPER */}
        <section className="border-t border-slate-800 pt-10 print:border-slate-300">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6 print:text-emerald-800">
            PART 2: EXECUTIVE WHITEPAPER
          </div>

          <div className="space-y-6 text-sm text-slate-300 leading-relaxed print:text-slate-800">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 print:text-black">1. Abstract</h3>
              <p>
                BotVault is an open-source, non-custodial decentralized application on the Botchain network that enables participants to securely lock native BOT tokens in a verified smart contract until an on-chain timestamp is reached. By establishing an immutable, autonomous savings mechanism, BotVault eliminates intermediary risks and curbs emotional market churn.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2 print:text-black">2. Protocol Mechanics</h3>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>
                  <strong>createVault(uint256 unlockTimestamp):</strong> Validates that the timestamp strictly exceeds the current block time and accepts an initial native BOT deposit. A unique vault ID is minted to the user.
                </li>
                <li>
                  <strong>depositToVault(uint256 vaultId):</strong> Allows the authorized vault owner to inject additional capital at any time prior to withdrawal, preserving the initial maturity timeline.
                </li>
                <li>
                  <strong>withdraw(uint256 vaultId):</strong> Strictly asserts that <code>block.timestamp &gt;= unlockTime</code> and that the vault has not previously been withdrawn. Funds are transferred directly to the owner via safe transfer patterns.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2 print:text-black">3. Smart Contract Verification</h3>
              <p>
                The BotVault contract is deployed to Botchain Mainnet at address <code>0x555e35a9dF9adFe84353e9FC018f46060Dcd8144</code> and utilizes OpenZeppelin security contracts. All code is public, audited in local unit tests, and verifiable on the Botchain Block Explorer.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 print:text-slate-400 print:border-slate-200">
          BotVault © 2026 • Decentralized Savings Protocol on Botchain • All rights reserved.
        </footer>
      </article>
    </div>
  );
}
