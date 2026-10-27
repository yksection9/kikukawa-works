// 予測ツール(飲食)用の天気を、気象庁から1日1回だけ取りに行き public/data/weather/jp47.json を更新する。
// GitHub Actions(.github/workflows/weather.yml)が毎朝動かす。利用者のブラウザから気象庁へはアクセスしない。
// 取りに行くもの:
//  - 前日までの実測(「最新の気象データ」の日降水量・最高気温CSV。全国1ファイルずつ。まだ入っていない日だけ、7日前まで)
//  - 47都道府県の天気予報(降水確率)。今日から7日分。翌日の分は「前日の予報の記録」として残す(過去の答え合わせ用)
// 使い方: node scripts/fetch-weather.mjs [jp47.json のパス]
import { readFileSync, writeFileSync } from "node:fs";

const FILE = process.argv[2] || new URL("../public/data/weather/jp47.json", import.meta.url).pathname;
const UA = "kikukawaworks.com forecast tool (daily, once a day)";
const WAIT_MS = 1500; // 気象庁のサーバーに負担をかけないよう、1件ずつ間をあける
// 1日1文字の詰め方(demo/build_weather.py と同じ)。「#」= 0、「!」= 欠測
const A = Array.from({ length: 92 }, (_, i) => String.fromCharCode(35 + i)).filter((c) => c !== "\\").join("");
const DAY = 86400000;
const iso = (t) => new Date(t).toISOString().slice(0, 10);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let requests = 0;

async function get(url, binary) {
  await sleep(WAIT_MS);
  requests++;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return binary ? new Uint8Array(await res.arrayBuffer()) : res.json();
}

// 都道府県の予報を出す気象台(予報の地域コード)。北海道は札幌(石狩・空知・後志)、鹿児島は奄美を除く本土、沖縄は沖縄本島
const officeOf = (i, pref) => (pref === "北海道" ? "016000" : pref === "鹿児島県" ? "460100" : pref === "沖縄県" ? "471000" : String(i + 1).padStart(2, "0") + "0000");

const data = JSON.parse(readFileSync(FILE, "utf8"));
const jstNow = Date.now() + 9 * 3600000;
const today = Date.parse(iso(jstNow)), yesterday = today - DAY;
const start = Date.parse(data.start);
const log = [];

// ---- 1. 実測: 最後の日の次の日から昨日までの枠を足し、欠けている日だけ取りに行く
const n0 = Math.round((Date.parse(data.end) - start) / DAY) + 1, n1 = Math.round((yesterday - start) / DAY) + 1;
if (n1 > n0) for (const p of data.prefs) { p[2] += "!".repeat(n1 - n0); p[3] += "!".repeat(n1 - n0); }
if (n1 > n0) data.end = iso(yesterday);
const sj = new TextDecoder("shift_jis");
// 品質情報: 0・1(観測なし・欠測)と2(疑問値)は使わない
const val = (v, q) => (v.trim() === "" || isNaN(+v) || ["0", "1", "2"].includes(q.trim()) ? NaN : +v);
for (let back = 7; back >= 1; back--) {
  const t = today - back * DAY, k = Math.round((t - start) / DAY);
  if (k < 0 || k >= n1 || data.prefs.every((p) => p[2][k] !== "!" && p[3][k] !== "!")) continue;
  const mmdd = iso(t).slice(5, 7) + iso(t).slice(8, 10);
  for (const [kind, url] of [["pr", `https://www.data.jma.go.jp/stats/data/mdrr/pre_rct/alltable/predaily${mmdd}.csv`], ["tx", `https://www.data.jma.go.jp/stats/data/mdrr/tem_rct/alltable/mxtemsadext${mmdd}.csv`]]) {
    let text;
    try { text = sj.decode(await get(url, true)); } catch (e) { log.push(`実測 ${iso(t)} ${kind}: 取得できず ${e.message}`); continue; }
    const rows = text.split(/\r?\n/).slice(1).map((l) => l.split(","));
    let filled = 0, wrongDay = 0;
    for (const p of data.prefs) {
      const r = rows.find((c) => c[3]?.trim() === p[4]); // 4列目 = 国際地点番号
      if (!r) continue;
      if (`${r[4]}-${r[5]}-${r[6]}` !== iso(t)) { wrongDay++; continue; } // 違う日のファイルが返ってきたときは使わない
      const v = val(r[9], r[10] || "");
      if (isNaN(v)) continue;
      const ch = kind === "pr" ? A[Math.min(89, Math.floor(v))] : A[Math.max(0, Math.min(90, Math.round(v) + 20))];
      const col = kind === "pr" ? 2 : 3;
      p[col] = p[col].slice(0, k) + ch + p[col].slice(k + 1);
      filled++;
    }
    const tokyo = rows.find((c) => c[3]?.trim() === "47662");
    log.push(`実測 ${iso(t)} ${kind}: ${filled}/47地点${wrongDay ? `(日付違い${wrongDay})` : ""} 東京の行: ${tokyo ? tokyo.slice(0, 11).join(",") : "なし"}`);
  }
}

// ---- 2. 予報: 今日から7日分の降水確率(%)。その日の6時間ごとの降水確率の一番高い値、なければ週間予報の値
const dates = Array.from({ length: 7 }, (_, i) => iso(today + i * DAY));
const fc = { issued: null, dates, pops: {} };
for (const [i, p] of data.prefs.entries()) {
  try {
    const j = await get(`https://www.jma.go.jp/bosai/forecast/data/forecast/${officeOf(i, p[0])}.json`);
    const day = {};
    const short = j[0]?.timeSeries.find((s) => s.areas?.[0]?.pops);
    short?.timeDefines.forEach((td, m) => { const v = +short.areas[0].pops[m]; const d = td.slice(0, 10); if (short.areas[0].pops[m] !== "" && !isNaN(v)) day[d] = Math.max(day[d] ?? 0, v); });
    const week = j[1]?.timeSeries?.find((s) => s.areas?.[0]?.pops);
    week?.timeDefines.forEach((td, m) => { const v = week.areas[0].pops[m], d = td.slice(0, 10); if (day[d] == null && v !== "" && !isNaN(+v)) day[d] = +v; });
    fc.pops[p[0]] = dates.map((d) => day[d] ?? null);
    fc.issued = fc.issued || j[0]?.reportDatetime;
  } catch (e) { log.push(`予報 ${p[0]}: 取得できず ${e.message}`); fc.pops[p[0]] = dates.map(() => null); }
}
const got = Object.values(fc.pops).filter((v) => v.some((x) => x != null)).length;
if (got) data.fc = fc;

// ---- 3. 前日の予報の記録: 今朝の予報のうち「明日」の降水確率を、明日の日付で残す(10%きざみを1文字に)
const H = data.fcHist;
const tomorrow = dates[1];
if (got) {
  if (!H.start) H.start = tomorrow;
  const kk = Math.round((Date.parse(tomorrow) - Date.parse(H.start)) / DAY);
  for (const p of data.prefs) {
    const s = (H.pops[p[0]] || "").padEnd(kk, "!");
    const v = fc.pops[p[0]][1];
    H.pops[p[0]] = s.slice(0, kk) + (v == null ? "!" : A[Math.round(v / 10)]) + s.slice(kk + 1);
  }
}
data.updated = new Date().toISOString();
writeFileSync(FILE, JSON.stringify(data));

const miss = (k) => data.prefs.filter((p) => p[k].slice(-7).includes("!")).length;
console.log(log.join("\n"));
console.log(`実測の最後の日 ${data.end} / 直近7日に欠けのある地点 降水${miss(2)} 気温${miss(3)} / 予報 ${got}/47都道府県(${fc.issued}) / 東京の予報 ${JSON.stringify(fc.pops["東京都"])} / 気象庁へのアクセス ${requests}回`);
if (!got) process.exit(1);
