import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { mainnet } from "viem/chains";
import Leaderboard from "./pages/Leaderboard";

const { publicClient } = configureChains([mainnet], [publicProvider()]);
const config = createConfig({ autoConnect: true, publicClient });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </BrowserRouter>
    </WagmiConfig>
  </React.StrictMode>
);
