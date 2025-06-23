import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/creator-rewards")
      .then(res => res.json())
      .then(data => {
        setWinners(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <h2>🏆 Creator Reward Winners</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {winners.map((winner: any, i: number) => (
            <li key={i}>
              <strong>{winner.fid}</strong> — Score: {winner.score}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
