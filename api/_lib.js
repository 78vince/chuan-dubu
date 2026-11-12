// 共用：Upstash Redis REST（Vercel Marketplace「Upstash for Redis」會自動帶入環境變數）
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// 與遊戲 RANKS 相同；1600 以上為九折（固定折扣碼，不需核銷、不記錄）
const RANKS = [
  {min: 1600, name: '義華路豆腐之神', reward: '來店消費整單 9 折', fixedCode: true},
  {min: 800, name: '嫩豆腐守護者', reward: '黃金炸豆腐免費兌換 1 份'},
  {min: 500, name: '實習接豆工', reward: '手工小菜免費兌換 1 份'},
  {min: 0, name: '豆腐殺手', reward: '幫老闆評論，韓國拉麵免費加購'},
];
const LIST = 'tofu-catch:redeems';
const KEY = id => 'tofu-catch:redeem:' + id;

function ready() { return Boolean(URL_ && TOKEN); }
async function pipeline(cmds) {
  const res = await fetch(URL_.replace(/\/$/, '') + '/pipeline', {
    method: 'POST', headers: {Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json'}, body: JSON.stringify(cmds),
  });
  if (!res.ok) throw new Error('redis ' + res.status);
  const out = await res.json();
  return out.map(r => { if (r.error) throw new Error(r.error); return r.result; });
}
function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-Owner-Pin');
  res.setHeader('Cache-Control', 'no-store');
}
function body(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch (e) { return {}; }
}
module.exports = {RANKS, LIST, KEY, ready, pipeline, cors, body};
