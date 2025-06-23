import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { WagmiProvider, createConfig, http } from "wagmi";
import { base, optimism } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Leaderboard from "./pages/Leaderboard";

// ✅ Optional: safer type fix with `as const`
const chains = [base, optimism] as const;

const config = createConfig({
  chains,
  transports: {
    [base.id]: http(),
    [optimism.id]: http(),
  },
  ssr: true,
} as any); // ✅ Paksakan tanpa error types

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
