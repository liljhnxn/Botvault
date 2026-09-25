"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http, WagmiProvider } from "wagmi";
import { injected } from "wagmi/connectors";
import { botchain, cleanRpcUrl } from "./chain";
import { useState } from "react";

export const wagmiConfig = createConfig({
  chains: [botchain],
  connectors: [injected()],
  transports: {
    [botchain.id]: http(cleanRpcUrl),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return <WagmiProvider config={wagmiConfig}><QueryClientProvider client={queryClient}>{children}</QueryClientProvider></WagmiProvider>;
}
