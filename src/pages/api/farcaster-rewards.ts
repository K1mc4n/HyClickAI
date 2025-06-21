// src/pages/api/farcaster-rewards.ts
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { periodsAgo = "0" } = req.query;
  try {
    const resp = await fetch(`https://api.farcaster.xyz/v1/developer-rewards-winner-history?periodsAgo=${periodsAgo}`);
    if (!resp.ok) throw new Error(`Error ${resp.status}`);
    const data = await resp.json();
    res.status(200).json(data.result.winners);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
