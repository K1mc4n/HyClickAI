import { useEffect, useState } from "react";

interface Winner {
  fid: number;
  score: number;
  rank: number;
  rewardCents: number;
  walletAddress: string;
}

// Fetcher untuk ambil data langsung dari Farcaster API
async function fetchRewards(
  endpoint: "developer" | "creator",
  periodsAgo: number
): Promise<Winner[]> {
  const resp = await fetch(
    `https://api.farcaster.xyz/v1/${endpoint}-rewards-winner-history?periodsAgo=${periodsAgo}`
  );

  if (!resp.ok) {
    throw new Error(`Error ${resp.status}: ${resp.statusText}`);
  }

  const data = await resp.json();
  return data.result.winners; // Ambil array winners
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
      {/* Dropdown PeriodsAgo */}
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
          <svg className="w-5 h-5 flex-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M4.293 19.707A8.978 8.978 0 0112 3a8.978 8.978 0 017.707 16.707L12 12l-7.7077.707z" />
          </svg>
          <span>{error}</span>
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
                  <li
                    key={`dev-${w.fid}`}
                    className="border p-3 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">FID: {w.fid}</p>
                      <p className="text-xs text-gray-500">Rank: {w.rank} • Score: {w.score}</p>
                    </div>
                    <span className="text-green-600 font-semibold">
                      ${(w.rewardCents / 100).toFixed(2)}
                    </span>
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
                  <li
                    key={`creator-${w.fid}`}
                    className="border p-3 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">FID: {w.fid}</p>
                      <p className="text-xs text-gray-500">Rank: {w.rank} • Score: {w.score}</p>
                    </div>
                    <span className="text-blue-600 font-semibold">
                      ${(w.rewardCents / 100).toFixed(2)}
                    </span>
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
