// src/pages/api/creator-rewards.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { periodsAgo = "0" } = req.query;
    const resp = await fetch(
      `https://api.farcaster.xyz/v1/creator-rewards-winner-history?periodsAgo=${periodsAgo}`
    );

    if (!resp.ok) {
      return res.status(resp.status).json({ error: resp.statusText });
    }

    const data = await resp.json();
    res.status(200).json(data.result.winners ?? []);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
