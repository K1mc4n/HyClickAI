import { useEffect, useState } from "react";
import { DuneClient } from "@duneanalytics/client-sdk";

interface TrendingUser {
  fid: number;
  username: string;
  reactions: number;
  totalCasts: number;
  ratio: number;
  fip2Ratio: number;
}

export default function Trending() {
  const [users, setUsers] = useState<TrendingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDuneData = async () => {
      const dune = new DuneClient(import.meta.env.VITE_DUNE_API_KEY); // pastikan VITE_DUNE_API_KEY ada di .env.local

      try {
        const res = await dune.getLatestResult({ queryId: 3023113 });

        // ✅ Tambahkan log debug
        console.log("✅ Dune Response:", res.result);
        const rows = res.result?.rows || [];
        console.log("📦 Parsed Rows:", rows);

        const parsed = rows.map((row: any) => {
          const username = row.username
            ?.match(/>(.*?)<\/a>/)?.[1] ?? "unknown"; // extract dari HTML <a>

          return {
            fid: row.fid,
            username,
            reactions: row.reactions_received ?? 0,
            totalCasts: row.total_casts ?? 0,
            ratio: row.reaction_cast_ratio ?? 0,
            fip2Ratio: row["top-level_fip2_ratio"] ?? 0,
          };
        });

        setUsers(parsed);
      } catch (err) {
        console.error("❌ Error fetching Dune data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDuneData();
  }, []);

  if (loading) return <p className="p-4">Loading from Dune...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🔥 Top Farcaster Users (by Reactions)</h1>
      {users.length === 0 ? (
        <p className="text-gray-500">No data available from Dune.</p>
      ) : (
        <ul className="space-y-4">
          {users.map((user) => (
            <li key={user.fid} className="border p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500">@{user.username}</div>
              <div className="text-md mt-1">💬 Total Casts: {user.totalCasts}</div>
              <div className="text-md">❤️ Reactions: {user.reactions}</div>
              <div className="text-sm text-gray-600 mt-1">
                Ratio: {(user.ratio).toFixed(2)} | FIP2: {(user.fip2Ratio).toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
