// api/creator-rewards.js
export default async function handler(req, res) {
  try {
    const { periodsAgo } = req.query;
    const url = `https://api.farcaster.xyz/v1/creator-rewards-winner-history${
      periodsAgo ? `?periodsAgo=${periodsAgo}` : ""
    }`;
    const resp = await fetch(url);
    if (!resp.ok) {
      return res.status(resp.status).json({ error: resp.statusText });
    }
    const data = await resp.json();
    // ✅ Add CORS header
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data.result.winners || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
