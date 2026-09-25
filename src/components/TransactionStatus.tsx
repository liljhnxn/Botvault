import { ExternalLink, AlertTriangle } from "lucide-react";
import { explorerUrl } from "@/config/chain";

export default function TransactionStatus({
  hash,
  error,
  success,
  reverted,
}: {
  hash?: `0x${string}`;
  error?: string;
  success?: boolean;
  reverted?: boolean;
}) {
  if (!hash && !error && !success && !reverted) return null;

  if (reverted) {
    return (
      <div className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
        <div className="flex items-center gap-2 font-bold text-red-100">
          <AlertTriangle size={16} /> Transaction Reverted on-chain
        </div>
        <p className="mt-1 text-xs text-red-200/90">
          The unlock date was not strictly in the future when mined by the network. Please choose a date at least 5–10 minutes in the future.
        </p>
        {hash && (
          <a
            className="mt-3 inline-flex items-center gap-1 text-xs text-red-300 underline hover:text-white"
            href={`${explorerUrl}/tx/${hash}`}
            target="_blank"
            rel="noreferrer"
          >
            View failed transaction on Botchain Explorer <ExternalLink size={12} />
          </a>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
        <p className="font-semibold text-red-100">Error</p>
        <p className="mt-1 text-xs">{error}</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="mt-4 rounded-xl border border-[rgba(186,255,105,.2)] bg-[rgba(186,255,105,.08)] p-4 text-sm text-[var(--accent)]">
        <p className="font-bold">Transaction successful!</p>
        {hash && explorerUrl ? (
          <a
            className="mt-2 inline-flex items-center gap-1 text-xs underline"
            href={`${explorerUrl}/tx/${hash}`}
            target="_blank"
            rel="noreferrer"
          >
            View on Botchain Explorer <ExternalLink size={13} />
          </a>
        ) : hash ? (
          <p className="mt-2 break-all text-xs">{hash}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-[var(--muted)]">
      <div className="flex items-center justify-between">
        <p className="font-medium text-white/90">Transaction submitted. Waiting for confirmation...</p>
      </div>
      {hash && (
        <a
          className="mt-2 inline-flex items-center gap-1 text-xs text-[var(--accent)] underline"
          href={`${explorerUrl}/tx/${hash}`}
          target="_blank"
          rel="noreferrer"
        >
          Track on Explorer <ExternalLink size={12} />
        </a>
      )}
      <p className="mt-3 border-t border-white/10 pt-2 text-xs leading-5 text-[var(--muted)]">
        Tip: If your transaction is taking long or not mining, open MetaMask &gt; <strong>Activity</strong> tab to check if the network rejected it due to insufficient gas fee reserve.
      </p>
    </div>
  );
}
