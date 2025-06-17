// src/App.tsx
import { sdk } from "@farcaster/frame-sdk";
import { useEffect } from "react";
import { useAccount, useConnect, useSignMessage } from "wagmi";
import { Link } from "react-router-dom";

function App() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Farcaster Mini App</h1>
      <nav className="space-x-4">
        <Link to="/market" className="text-blue-500 underline">Market</Link>
        <Link to="/trending" className="text-blue-500 underline">Trending</Link>
        <Link to="/leaderboard" className="text-blue-500 underline">Leaderboard</Link>
      </nav>
      <ConnectMenu />
    </div>
  );
}

function ConnectMenu() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();

  if (isConnected) {
    return (
      <>
        <div className="text-green-600">Connected account: {address}</div>
        <SignButton />
      </>
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

function SignButton() {
  const { signMessage, isPending, data, error } = useSignMessage();

  return (
    <div className="mt-2 space-y-2">
      <button
        type="button"
        className="px-4 py-2 bg-purple-600 text-white rounded"
        onClick={() => signMessage({ message: "hello world" })}
        disabled={isPending}
      >
        {isPending ? "Signing..." : "Sign message"}
      </button>
      {data && (
        <div className="text-sm text-gray-700">
          <div>Signature:</div>
          <div className="break-all">{data}</div>
        </div>
      )}
      {error && (
        <div className="text-sm text-red-600">
          <div>Error:</div>
          <div>{error.message}</div>
        </div>
      )}
    </div>
  );
}

export default App;
