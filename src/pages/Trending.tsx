// src/pages/Trending.tsx
import { useEffect, useState } from "react";

interface Cast {
  hash: string;
  text: string;
  author: {
    username: string;
  };
  reactions: number;
  recasts: number;
}

// Dummy data simulating trending casts
const dummyCasts: Cast[] = [
  {
    hash: "0xabc1",
    text: "What are your thoughts on ETH 2.0?",
    author: { username: "alice" },
    reactions: 42,
    recasts: 17,
  },
  {
    hash: "0xabc2",
    text: "New governance proposal is live!",
    author: { username: "bob" },
    reactions: 35,
    recasts: 22,
  },
  {
    hash: "0xabc3",
    text: "Loving the new Frames integration ✨",
    author: { username: "carol" },
    reactions: 28,
    recasts: 15,
  },
];

export default function Trending() {
  const [casts, setCasts] = useState<Cast[]>([]);

  useEffect(() => {
    // Replace with actual API call if available
    setCasts(dummyCasts);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🔥 Trending Casts</h1>
      <ul className="space-y-4">
        {casts.map((cast) => (
          <li key={cast.hash} className="border p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">@{cast.author.username}</div>
            <div className="text-lg font-medium mt-1">{cast.text}</div>
            <div className="text-sm mt-2 text-gray-600">
              ❤️ {cast.reactions} &nbsp; 🔁 {cast.recasts}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

