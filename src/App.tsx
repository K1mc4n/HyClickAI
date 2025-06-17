// src/App.tsx
import { sdk } from "@farcaster/frame-sdk";
import { useEffect } from "react";
import { useAccount, useConnect, useSignMessage } from "wagmi";
import { Link } from "react-router-dom";

export default function App() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">HyClickAI MiniApp</h1>
      <p className="text-gray-600">Silakan pilih fitur:</p>
      <ul className="space-y-2">
        <li>
          <Link to="/market" className="text-blue-500 underline">
            📊 Market Viewers
          </Link>
        </li>
        <li>
          <Link to="/trending" className="text-blue-500 underline">
            🔥 Trending Casts
          </Link>
        </li>
        <li>
          <Link to="/leaderboard" className="text-blue-500 underline">
            🏆 Leaderboard Rewards
          </Link>
        </li>
      </ul>

      <hr className="my-4 border-gray-300" />
      <ConnectWallet />
    </div>
  );
}

function ConnectWallet() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();

  if (isConnected) {
    return (
      <div>
        <div className="text-green-600">✅ Connected: {address}</div>
        <SignMessageButton />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="px-4 py-2 bg-blue-600 text-white rounded"
      onClick={() => connect({ connector: connectors[0] })}
    >
      Connect Wallet
    </button>
  );
}

function SignMessageButton() {
  const { signMessage, isPending, data, error } = useSignMessage();

  return (
    <div className="mt-2 space-y-2">
      <button
        type="button"
        className="px-4 py-2 bg-purple-600 text-white rounded"
        onClick={() => signMessage({ message: "hello world" })}
        disabled={isPending}
      >
        {isPending ? "Signing..." : "Sign Message"}
      </button>
      {data && (
        <div className="text-sm break-words text-gray-700">
          ✅ Signature: <span className="break-all">{data}</span>
        </div>
      )}
      {error && <div className="text-sm text-red-600">❌ {error.message}</div>}
    </div>
  );
}
