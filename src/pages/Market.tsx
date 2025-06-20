import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const fetchMarketData = async () => {
  const res = await axios.get(
    "https://api.coingecko.com/api/v3/coins/markets",
    {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 10,
        page: 1,
        sparkline: false,
      },
    }
  );
  return res.data;
};

export default function Market() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["marketData"],
    queryFn: fetchMarketData,
  });

  const [search, setSearch] = useState("");

  if (isLoading) return <div className="p-4">Loading market data...</div>;
  if (error) return <div className="p-4 text-red-500">Error fetching data</div>;

  const filteredData = data.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Top 10 Crypto Markets</h1>

      <input
        type="text"
        placeholder="Search coin..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />

      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-2">Name</th>
            <th className="border-b p-2">Price</th>
            <th className="border-b p-2">Change 24h</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((coin) => (
            <tr key={coin.id} className="hover:bg-gray-50">
              <td className="border-b p-2 flex items-center gap-2 max-w-[120px]">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-4 h-4 object-contain"
                />
                {coin.name}
              </td>
              <td className="border-b p-2">${coin.current_price.toLocaleString()}</td>
              <td
                className={`border-b p-2 ${
                  coin.price_change_percentage_24h >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
