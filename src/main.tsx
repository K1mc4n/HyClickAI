import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import Market from "./pages/Market";
import Trending from "./pages/Trending";
import Leaderboard from "./pages/Leaderboard";
import { config } from "./wagmi";

import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App /> as JSX.Element} />
            <Route path="/market" element={<Market /> as JSX.Element} />
            <Route path="/trending" element={<Trending /> as JSX.Element} />
            <Route path="/leaderboard" element={<Leaderboard /> as JSX.Element} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
