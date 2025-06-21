// api/creator-rewards.js
const fetch = require('node-fetch'); // untuk node
module.exports = async (req, res) => {
  try {
    const periodsAgo = req.query.periodsAgo || 0;
    const resp = await fetch(`https://api.farcaster.xyz/v1/creator-rewards-winner-history?periodsAgo=${periodsAgo}`)
    if (!resp.ok) {
      return res.status(resp.status).send(await resp.text())
    }
    const json = await resp.json();
    return res.status(200).json(json.result.winners)
  } catch (e) {
    return res.status(500).send(e.message)
  }
};
