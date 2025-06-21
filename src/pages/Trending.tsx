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

// Fetcher untuk ambil data
async function fetchRewards(
  endpoint: "developer" | "creator",
  periodsAgo: number
): Promise<Winner[]> {
  const resp = await fetch(`/api/${endpoint}-rewards?periodsAgo=${periodsAgo}`);
  if (!resp.ok) {
    throw new Error(`Error ${resp.status}: ${resp.statusText}`);
  }
  return resp.json();
}

export default function Trending() {
  const [periodsAgo, setPeriodsAgo] = useState(0);
  const [devWinners, setDevWinners] = useState<Winner[]>([]);
  const [creatorWinners, setCreatorWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
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
    })();
  }, [periodsAgo]);

  return (
    <div className="p-4 space-y-8">
      {/* PeriodsAgo */}
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
      {error && <div className="bg-red-100 border border-red-400 p-4 rounded">{error}</div>}

      {/* Loading */}
      {loading && <p>Loading rewards data…</p>}

      {/* Developer Rewards */}
      {!loading && !error && (
        <>
          <section>
            <h1 className="text-2xl font-bold mb-4">🏆 Top Developer Rewards</h1>
            {devWinners.length === 0 ? (
              <p>No developer rewards available.</p>
            ) : (
              <ul className="space-y-3">
                {devWinners.map((w) => (
                  <li key={`dev-${w.fid}`} className="border p-3 rounded flex justify-between">
                    <div>
                      <p>{w.frameName || w.domain}</p>
                      <p>FID: {w.fid} • Rank: {w.rank}</p>
                    </div>
                    <span>${(w.rewardCents / 100).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h1 className="text-2xl font-bold mb-4">🏅 Top Creator Rewards</h1>
            {creatorWinners.length === 0 ? (
              <p>No creator rewards available.</p>
            ) : (
              <ul className="space-y-3">
                {creatorWinners.map((w) => (
                  <li key={`creator-${w.fid}`} className="border p-3 rounded flex justify-between">
                    <div>
                      <p>{w.frameName || w.domain}</p>
                      <p>FID: {w.fid} • Rank: {w.rank}</p>
                    </div>
                    <span>${(w.rewardCents / 100).toFixed(2)}</span>
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
