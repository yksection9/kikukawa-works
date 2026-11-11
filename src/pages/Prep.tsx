import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Field, Section } from '../components/Calc'
import { usePageTitle } from '../usePageTitle'

// 飲食店の仕込み量とスタッフ人数を計算するページ(無料・登録なし)。「仕込み量 計算」「食品ロス 計算」などで来た人の入口で、
// 下で来客数の予測ツール(/forecast/restaurant)へつなぐ。上乗せ分がそのまま余ったときの原価も出し、予想の精度がお金に効くことを見せる。

const yen = (v: number) => `${Math.round(v).toLocaleString('ja-JP')}円`

export function Prep() {
  usePageTitle('仕込み量と必要なスタッフの人数を計算(飲食店・無料)')
  const [guests, setGuests] = useState(80)
  const [orderPct, setOrderPct] = useState(35)
  const [bufferPct, setBufferPct] = useState(15)
  const [cost, setCost] = useState(300)
  const [perStaff, setPerStaff] = useState(25)
  const [minStaff, setMinStaff] = useState(2)
  const [days, setDays] = useState(25)

  const ok = [guests, orderPct, bufferPct, cost, perStaff, minStaff, days].every((v) => Number.isFinite(v) && v >= 0) && perStaff > 0
  const base = ok ? (guests * orderPct) / 100 : 0
  const prep = ok ? Math.ceil(base * (1 + bufferPct / 100)) : 0
  const extra = prep - base
  const staff = ok ? Math.max(minStaff, Math.ceil(guests / perStaff)) : 0
  const monthLoss = ok ? extra * cost * days : 0

  return (
    <div className="bg-fc-paper font-fc text-fc-ink">
      <div className="mx-auto max-w-5xl px-4 pt-8 pb-16 sm:px-6">
        <p className="inline-block rounded-full bg-fc-soft px-3 py-1 text-sm font-bold text-fc-accent">無料・登録なし</p>
        <h1 className="mt-4 text-[30px] leading-[1.3] font-black text-balance [word-break:auto-phrase] sm:text-[40px]">仕込み量と、必要なスタッフの人数を計算する</h1>
        <p className="mt-5 max-w-[38em] text-[17px] leading-[1.85] text-fc-sub">
          来客数の見込みと、メニューを頼む人の割合を入れると、仕込み量の目安とスタッフの人数が出ます。品切れを防ぐための上乗せが、余ったときに1か月でいくらになるかも分かります。入れた数字はどこにも送りません。
        </p>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-12">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="1日の来客数の見込み" unit="人" value={guests} onChange={setGuests} />
            <Field label="このメニューを頼む割合" hint="お客さん100人のうち何人か" unit="%" value={orderPct} onChange={setOrderPct} />
            <Field label="品切れを防ぐ上乗せ" unit="%" value={bufferPct} onChange={setBufferPct} />
            <Field label="1食あたりの原価" unit="円" value={cost} onChange={setCost} step={10} />
            <Field label="スタッフ1人が対応できる客数" hint="1日あたり" unit="人" value={perStaff} onChange={setPerStaff} />
            <Field label="暇な日でも必要な人数" unit="人" value={minStaff} onChange={setMinStaff} />
            <Field label="1か月の営業日" unit="日" value={days} onChange={setDays} />
          </div>

          <div className="rounded-xl border border-fc-line bg-white shadow-[0_16px_32px_-20px_rgba(29,36,34,0.35)]" aria-live="polite">
            <p className="border-b border-fc-line px-4 py-3 font-bold">計算の結果</p>
            {ok ? (
              <div className="space-y-4 px-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-fc-sub">仕込み量の目安</p>
                    <p className="text-[36px] leading-tight font-black text-fc-accent tabular-nums">{prep}食</p>
                  </div>
                  <div>
                    <p className="text-sm text-fc-sub">スタッフの人数</p>
                    <p className="text-[36px] leading-tight font-black text-fc-accent tabular-nums">{staff}人</p>
                  </div>
                </div>
                <p className="text-sm text-fc-sub">見込みどおりなら売れるのは約{Math.round(base)}食で、上乗せは約{Math.round(extra)}食です。</p>
                <div className="border-t border-fc-line pt-3">
                  <p className="text-sm text-fc-sub">上乗せが毎日そのまま余ると、1か月で</p>
                  <p className="text-2xl font-bold tabular-nums">{yen(monthLoss)}</p>
                  <p className="mt-1 text-sm leading-relaxed text-fc-sub">来客数の見込みが当たるほど、上乗せを小さくできます。</p>
                </div>
              </div>
            ) : (
              <p className="px-4 py-4 text-sm text-fc-sub">数字を入れると、ここに結果が出ます。</p>
            )}
          </div>
        </div>

        <Section title="この計算について">
          <div className="max-w-[38em] space-y-3 leading-[1.85]">
            <p>仕込み量は「来客数の見込み × 頼む人の割合」に、品切れを防ぐための上乗せを足したものです。スタッフの人数は「来客数 ÷ 1人が対応できる客数」を切り上げ、暇な日でも必要な人数を下回らないようにしています。</p>
            <p>上乗せを大きくすれば品切れは減りますが、そのぶん余る食事が増えます。どれくらい上乗せが要るかは、来客数の見込みがどれくらい外れるかで決まります。見込みの外れが半分になれば、上乗せもおおむね半分で済みます。</p>
            <p className="text-sm text-fc-sub">上乗せがすべて余ったときの最大の金額です。実際には品切れの日や売り切れる日もあるので、目安として使ってください。</p>
          </div>
        </Section>

        <section className="mt-16 rounded-xl bg-fc-ink p-6 text-white sm:mt-20 sm:p-8">
          <h2 className="text-[21px] font-bold sm:text-[27px]">来週の来客数の見込みが立たないときは</h2>
          <p className="mt-4 max-w-[38em] leading-[1.85] text-white/85">
            来客数の記録(CSV)を入れると、曜日・祝日・予約数・雨の予報も考えに入れて来週の来客数を予想し、仕込み量とスタッフの人数まで出すツールを無料(ベータ版)で公開しています。
          </p>
          <Link
            to="/forecast/restaurant?from=prep"
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3.5 font-bold text-fc-ink transition-colors hover:bg-fc-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            来客数の予測ツールを見る
          </Link>
        </section>
      </div>
    </div>
  )
}
