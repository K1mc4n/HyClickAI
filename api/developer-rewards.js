// api/developer-rewards.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const periodsAgo = req.query.periodsAgo || 0;

  try {
    const resp = await fetch(
      `https://api.farcaster.xyz/v1/developer-rewards-winner-history?periodsAgo=${periodsAgo}`
    );

    if (!resp.ok) {
      return res.status(resp.status).send(await resp.text());
    }

    const json = await resp.json();
    return res.status(200).json(json.result.winners); // hanya bagian winners
  } catch (error) {
    return res.status(500).send(error.message || "Error fetching data");
  }
};
