// GET  /api/records            — 業主頁面讀取兌換紀錄（需 PIN，放在 X-Owner-Pin header）
// POST /api/records {action:'purge-test'} — 清除預覽／測試資料
const {LIST, KEY, ready, pipeline, cors, body} = require('./_lib');

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  const pin = process.env.OWNER_PIN;
  if (!pin) return res.status(503).json({error: '尚未設定 OWNER_PIN'});
  if (req.headers['x-owner-pin'] !== pin) return res.status(401).json({error: 'PIN 錯誤'});
  if (!ready()) return res.status(503).json({error: '尚未設定資料庫'});
  try {
    const [raw] = await pipeline([['LRANGE', LIST, '0', '-1']]);
    const list = (raw || []).map(s => { try { return JSON.parse(s); } catch (e) { return null; } }).filter(Boolean);
    if (req.method === 'GET') return res.status(200).json({records: list});
    if (req.method === 'POST' && body(req).action === 'purge-test') {
      const tests = list.filter(r => r.test), keep = list.filter(r => !r.test);
      const cmds = [['DEL', LIST], ...tests.map(r => ['DEL', KEY(r.id)])];
      if (keep.length) cmds.push(['RPUSH', LIST, ...keep.map(r => JSON.stringify(r))]);
      await pipeline(cmds);
      return res.status(200).json({ok: true, removed: tests.length});
    }
    return res.status(405).json({error: 'method'});
  } catch (e) {
    return res.status(500).json({error: 'storage'});
  }
};
