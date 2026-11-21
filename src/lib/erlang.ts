// コールセンターの必要人数(アーランC)。
// 式は予測ツールのエンジン(汎用予測ツール/demo/engine.js の erlangStaff)と同じ。
// ただし A^k/k! を直接足すと入電が多いとき桁あふれするので、同じ値になるアーランBの漸化式で計算する。
//   B(0) = 1, B(k) = A·B(k-1) / (k + A·B(k-1))
//   待たされる割合 C = N·B(N) / (N − A·(1 − B(N)))
//   目標の秒数以内に出られる割合 = 1 − C·exp(−(N − A)·目標秒数 / 平均処理時間)
//   平均の待ち時間 = C·平均処理時間 / (N − A)

export type ErlangInput = {
  /** 区切り(intervalMin 分)あたりの入電数 */
  calls: number
  intervalMin: number
  /** 1件の平均処理時間(通話+後処理)秒 */
  ahtSec: number
  /** 目標: slSec 秒以内に slPct % の電話に出る */
  slPct: number
  slSec: number
  /** 休憩・研修などで電話に出られない割合 % */
  shrinkPct: number
}

export type ErlangRow = {
  agents: number
  /** 待たされる電話の割合(0〜1) */
  wait: number
  /** 目標の秒数以内に出られる割合(0〜1) */
  sl: number
  /** 平均の待ち時間(秒) */
  asa: number
  /** 稼働率(0〜1) */
  occ: number
}

/** 電話の量(アーラン)。ずっと話し続けている人が何人分か */
export const trafficOf = (i: ErlangInput) => (i.calls * i.ahtSec) / (i.intervalMin * 60)

/** 人数 N のときの値。N が電話の量以下だと電話がたまり続ける(null) */
export function erlangRow(A: number, N: number, ahtSec: number, slSec: number): ErlangRow | null {
  if (!(N > A) || !(A > 0)) return null
  let B = 1
  for (let k = 1; k <= N; k++) B = (A * B) / (k + A * B)
  const wait = (N * B) / (N - A * (1 - B))
  return {
    agents: N,
    wait,
    sl: 1 - wait * Math.exp((-(N - A) * slSec) / ahtSec),
    asa: (wait * ahtSec) / (N - A),
    occ: A / N,
  }
}

export type ErlangResult = {
  traffic: number
  /** 目標に届く最小の人数(電話に出ている人) */
  required: ErlangRow
  /** 休憩などを差し引いて、シフトに入れる人数 */
  staff: number
  /** 必要人数の前後の一覧 */
  table: { agents: number; row: ErlangRow | null }[]
}

export function inputError(i: ErlangInput): string | null {
  if (!(i.calls > 0)) return '入電数に、0より大きい数を入れてください。'
  if (!(i.ahtSec > 0)) return '平均処理時間に、0より大きい秒数を入れてください。'
  if (!(i.slPct > 0 && i.slPct < 100)) return '目標の割合は、1〜99の間で入れてください。'
  if (!(i.slSec >= 0)) return '目標の秒数に、0以上の数を入れてください。'
  if (!(i.shrinkPct >= 0 && i.shrinkPct < 100)) return '電話に出られない割合は、0〜99の間で入れてください。'
  if (trafficOf(i) > 5000) return '電話の量が大きすぎます。区切りを短くするか、窓口ごとに分けて計算してください。'
  return null
}

export function erlangC(i: ErlangInput): ErlangResult | null {
  if (inputError(i)) return null
  const A = trafficOf(i)
  let required: ErlangRow | null = null
  for (let N = Math.floor(A) + 1; N <= Math.ceil(A) + 2000; N++) {
    const r = erlangRow(A, N, i.ahtSec, i.slSec)
    if (r && r.sl >= i.slPct / 100) {
      required = r
      break
    }
  }
  if (!required) return null
  const N = required.agents
  const table = []
  for (let n = Math.max(1, N - 3); n <= N + 2; n++) table.push({ agents: n, row: erlangRow(A, n, i.ahtSec, i.slSec) })
  return { traffic: A, required, staff: Math.ceil(N / (1 - i.shrinkPct / 100) - 1e-9), table }
}
