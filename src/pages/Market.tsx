// src/pages/Market.tsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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

  if (isLoading) return <div className="p-4">Loading market data...</div>;
  if (error) return <div className="p-4 text-red-500">Error fetching data</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Top 10 Crypto Markets</h1>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-2">Name</th>
            <th className="border-b p-2">Price</th>
            <th className="border-b p-2">Change 24h</th>
          </tr>
        </thead>
        <tbody>
          {data.map((coin: any) => (
            <tr key={coin.id} className="hover:bg-gray-50">
              <td className="border-b p-2 flex items-center gap-2">
                <img src={coin.image} alt={coin.name} className="w-5 h-5" />
                {coin.name}
              </td>
              <td className="border-b p-2">${coin.current_price.toLocaleString()}</td>
              <td
                className={`border-b p-2 ${
                  coin.price_change_percentage_24h >= 0 ? "text-green-600" : "text-red-600"
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

