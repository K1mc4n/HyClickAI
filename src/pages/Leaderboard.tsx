// src/pages/Leaderboard.tsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface UserScore {
  username: string;
  score: number;
}

const fetchLeaderboard = async (): Promise<UserScore[]> => {
  const res = await axios.get("https://api.example.com/leaderboard"); // Ganti dengan endpoint backend kamu
  return res.data;
};

export default function Leaderboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: fetchLeaderboard,
  });

  if (isLoading) return <div className="p-4">Loading leaderboard...</div>;
  if (error) return <div className="p-4 text-red-500">Failed to load leaderboard</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🏆 Farcaster Reward Leaderboard</h1>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-2">Rank</th>
            <th className="border-b p-2">Username</th>
            <th className="border-b p-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, index) => (
            <tr
              key={user.username}
              className={`hover:bg-gray-50 ${
                index === 0 ? "bg-yellow-100" : index === 1 ? "bg-gray-100" : index === 2 ? "bg-orange-100" : ""
              }`}
            >
              <td className="border-b p-2">{index + 1}</td>
              <td className="border-b p-2">@{user.username}</td>
              <td className="border-b p-2">{user.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

