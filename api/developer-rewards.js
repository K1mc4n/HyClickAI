// api/developer-rewards.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    const periodsAgo = req.query.periodsAgo || "0";
    const resp = await fetch(
      `https://api.farcaster.xyz/v1/developer-rewards-winner-history?periodsAgo=${periodsAgo}`
    );

    if (!resp.ok) {
      return res.status(resp.status).send(`Error ${resp.statusText}`);
    }

    const data = await resp.json();
    res.status(200).json(data.result.winners || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
