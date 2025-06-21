import { useEffect, useState } from "react";

interface Winner {
  fid: number;
  frameName?: string;
  domain?: string;
  score: number;
  rank: number;
  rewardCents: number;
  walletAddress: string;
}

// Fetcher untuk ambil data langsung dari API Farcaster
async function fetchRewards(
  endpoint: "developer" | "creator",
  periodsAgo: number
): Promise<Winner[]> {
  const apiUrl =
    endpoint === "creator"
      ? `https://api.farcaster.xyz/v1/creator-rewards-winner-history?periodsAgo=${periodsAgo}`
      : `https://api.farcaster.xyz/v1/developer-rewards-winner-history?periodsAgo=${periodsAgo}`;

  const resp = await fetch(apiUrl);
  if (!resp.ok) {
    throw new Error(`Error ${resp.status}: ${resp.statusText}`);
  }

  const json = await resp.json();
  return json.result.winners; // Ambil winners langsung
}

export default function Trending() {
  const [periodsAgo, setPeriodsAgo] = useState(0);
  const [devWinners, setDevWinners] = useState<Winner[]>([]);
  const [creatorWinners, setCreatorWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [dev, creators] = await Promise.all([
          fetchRewards("developer", periodsAgo),
          fetchRewards("creator", periodsAgo),
        ]);

        setDevWinners(dev);
        setCreatorWinners(creators);
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
      {/* Dropdown periods */}
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
            <option key={p} value={p}>{p === 0 ? "Current period" : `${p} period ago`}</option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg flex items-center space-x-2">
          ⚠️ <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading && <p className="text-center text-gray-500">Loading rewards data…</p>}

      {/* Developer Rewards */}
      {!loading && !error && (
        <>
          <section>
            <h1 className="text-2xl font-bold mb-4">🏆 Top Developer Rewards</h1>
            {devWinners.length === 0 ? (
              <p className="text-gray-500">No developer rewards available.</p>
            ) : (
              <ul className="space-y-3">
                {devWinners.map((w) => (
                  <li key={`dev-${w.fid}`} className="border p-3 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium">{w.frameName || w.domain}</p>
                      <p className="text-xs text-gray-500">FID: {w.fid} • Rank: {w.rank}</p>
                    </div>
                    <span className="text-green-600 font-semibold">${(w.rewardCents / 100).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Creator Rewards */}
          <section>
            <h1 className="text-2xl font-bold mb-4">🏅 Top Creator Rewards</h1>
            {creatorWinners.length === 0 ? (
              <p className="text-gray-500">No creator rewards available.</p>
            ) : (
              <ul className="space-y-3">
                {creatorWinners.map((w) => (
                  <li key={`creator-${w.fid}`} className="border p-3 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium">{w.frameName || w.domain}</p>
                      <p className="text-xs text-gray-500">FID: {w.fid} • Rank: {w.rank}</p>
                    </div>
                    <span className="text-blue-600 font-semibold">${(w.rewardCents / 100).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
