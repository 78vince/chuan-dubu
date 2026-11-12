// POST /api/redeem — 店員在遊戲優惠券頁長按核銷時，遊戲送出一筆兌換紀錄
const {RANKS, LIST, KEY, ready, pipeline, cors, body} = require('./_lib');

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({error: 'method'});
  if (!ready()) return res.status(503).json({error: '尚未設定資料庫'});
  const b = body(req);
  const id = String(b.id || ''), score = Number(b.score);
  if (!/^[a-z0-9]{6,32}$/.test(id) || !Number.isInteger(score) || score < 0 || score > 9999) return res.status(400).json({error: 'bad input'});
  const rank = RANKS.find(r => score >= r.min);
  if (rank.fixedCode) return res.status(400).json({error: '九折券不需核銷'});
  const rec = {
    id, score, tier: rank.name, reward: rank.reward,
    playedOn: /^\d{4}\/\d{2}\/\d{2}$/.test(b.playedOn) ? b.playedOn : null,
    redeemedAt: new Date().toISOString(),
    deviceAt: typeof b.redeemedAt === 'string' ? b.redeemedAt.slice(0, 30) : null,
    test: !!b.test,
  };
  try {
    const [set] = await pipeline([['SET', KEY(id), JSON.stringify(rec), 'NX']]);
    if (set !== 'OK') return res.status(409).json({error: '已記錄過'});
    await pipeline([['RPUSH', LIST, JSON.stringify(rec)]]);
    return res.status(200).json({ok: true});
  } catch (e) {
    return res.status(500).json({error: 'storage'});
  }
};
