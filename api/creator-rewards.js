export default async function handler(req, res) {
  const url = "https://api.farcaster.xyz/v1/creator-rewards-winner-history";

  try {
    const response = await fetch(url);
    const contentType = response.headers.get("content-type");

    if (!response.ok || !contentType.includes("application/json")) {
      const text = await response.text();
      return res.status(500).json({
        error: "Unexpected response",
        details: text.slice(0, 200),
      });
    }

    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(data.result?.winners ?? []);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
