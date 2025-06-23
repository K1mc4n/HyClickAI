// api/creator-rewards.js
export default async function handler(req, res) {
  try {
    const { periodsAgo } = req.query;
    const url = `https://api.farcaster.xyz/v1/creator-rewards-winner-history${periodsAgo ? `?periodsAgo=${periodsAgo}` : ""}`;
    
    const resp = await fetch(url);
    const contentType = resp.headers.get("content-type");

    if (!resp.ok) {
      const text = await resp.text(); // even if not JSON, log response
      return res.status(resp.status).json({
        error: `API error: ${resp.statusText}`,
        details: text.slice(0, 100)
      });
    }

    if (!contentType || !contentType.includes("application/json")) {
      const text = await resp.text();
      return res.status(500).json({
        error: "Expected JSON, got non-JSON response",
        details: text.slice(0, 100)
      });
    }

    const data = await resp.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data.result.winners || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
