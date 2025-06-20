import { sdk } from "@farcaster/frame-sdk";
import { useEffect } from "react";
import { useAccount, useConnect, useSignMessage } from "wagmi";
import { Link } from "react-router-dom";

export default function App() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <main className="container">
      <header className="header">
        <h1>Farcaster Portal</h1>
        <p>Silakan pilih fitur di bawah ini:</p>
      </header>

      <section className="features">
        <FeatureCard title="📊 Market Viewers" to="/market" />
        <FeatureCard title="🔥 Trending Casts" to="/trending" />
        <FeatureCard title="🏆 Leaderboard Rewards" to="/leaderboard" />
      </section>

      <section className="wallet">
        <ConnectWallet />
      </section>
    </main>
  );
}

function FeatureCard({ title, to }: { title: string; to: string }) {
  return (
    <Link to={to} className="card">
      {title}
    </Link>
  );
}

function ConnectWallet() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();

  if (isConnected) {
    return (
      <div className="wallet-box">
        <div className="connected">✅ {address}</div>
        <SignMessageButton />
      </div>
    );
  }

  return (
    <button className="btn-primary" onClick={() => connect({ connector: connectors[0] })}>
      Connect Wallet
    </button>
  );
}

function SignMessageButton() {
  const { signMessage, isPending, data, error } = useSignMessage();

  return (
    <div className="sign-box">
      <button className="btn-secondary" onClick={() => signMessage({ message: "hello world" })} disabled={isPending}>
        {isPending ? "Signing..." : "Sign Message"}
      </button>
      {data && <div className="info">✅ Signature: {data}</div>}
      {error && <div className="error">❌ {error.message}</div>}
    </div>
  );
}
