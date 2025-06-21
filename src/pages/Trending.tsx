import { useEffect, useState } from "react";

interface Winner {
  fid: number;
  score: number;
  rank: number;
  rewardCents: number;
  walletAddress: string;
}

// Fetcher untuk ambil data creator rewards
async function fetchCreatorRewards(periodsAgo: number): Promise<Winner[]> {
  const resp = await fetch(
    `https://api.farcaster.xyz/v1/creator-rewards-winner-history?periodsAgo=${periodsAgo}`
  );

  if (!resp.ok) {
    throw new Error(`Error ${resp.status}: ${resp.statusText}`);
  }

  const json = await resp.json();
  return json.result.winners;
}

export default function Trending() {
  const [periodsAgo, setPeriodsAgo] = useState(0);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCreatorRewards(periodsAgo);
        setWinners(data);
      } catch (err: any) {
        setError(err.message || "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [periodsAgo]);

  return (
    <div className="p-4 space-y-8">
      <div className="flex items-center space-x-2">
        <label htmlFor="periodsAgo" className="font-medium">
          Show data from period:
        </label>
        <select
          id="periodsAgo"
          value={periodsAgo}
          onChange={(e) => setPeriodsAgo(Number(e.target.value))}
          className="border rounded-md p-2"
        >
          {[0, 1, 2, 3, 4].map((p) => (
            <option key={p} value={p}>
              {p === 0 ? "Current period" : `${p} period ago`}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg flex items-center space-x-2">
          <span>{error}</span>
        </div>
      )}

      {loading && <p className="text-center text-gray-500">Loading rewards data…</p>}

      {!loading && !error && (
        <section>
          <h1 className="text-2xl font-bold mb-4">🏅 Top Creator Rewards</h1>
          {winners.length === 0 ? (
            <p className="text-gray-500">No creator rewards available.</p>
          ) : (
            <ul className="space-y-3">
              {winners.map((w) => (
                <li
                  key={w.fid}
                  className="border p-3 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">FID: {w.fid}</p>
                    <p className="text-xs text-gray-500">Rank: {w.rank} • Score: {w.score}</p>
                    {w.walletAddress && (
                      <p className="text-xs text-gray-500 truncate">Wallet: {w.walletAddress}</p>
                    )}
                  </div>
                  <span className="text-blue-600 font-semibold">
                    ${(w.rewardCents / 100).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
