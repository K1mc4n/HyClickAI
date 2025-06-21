import fetch from "node-fetch";

export default async function handler(req: any, res: any) {
  const periodsAgo = req.query.periodsAgo || 0;
  try {
    const resp = await fetch(`https://api.farcaster.xyz/v1/developer-rewards-winner-history?periodsAgo=${periodsAgo}`);
    const data = await resp.json();
    res.status(200).json(data.result.winners); // ambil winners
  } catch (error) {
    res.status(500).json({ error: "Error fetching developer rewards" });
  }
}
