import { useEffect, useState } from 'react'
import { supabase } from './supabase.js'
import { watchFreshness } from './freshness.js'
import { SITE_BASE } from './site.js'
import './trip.css'

// 行程一覽(#/trips):列出所有已公開行程嘅卡片。首頁「精選行程」入口指去呢度,
// 加／發布新行程就自動多一張卡,首頁唔使改。撳卡片 → #/t/<slug> 單一行程頁。
const wikiThumb = (u, w) => {
  if (!u || !/wiki\/Special:FilePath/i.test(u)) return u
  if (/[?&]width=/i.test(u)) return u.replace(/([?&]width=)\d+/i, '$1' + w)
  return u + (u.includes('?') ? '&' : '?') + 'width=' + w
}
const isTbd = (v) => /待定|待確認|待查/.test(String(v))

// 由行程資料拎結構化摘要:X日Y夜 + 目的地
const spanOf = (d) => { const n = (d.days || []).length; return n ? `${n}日${n > 1 ? (n - 1) + '夜' : ''}` : '' }
const destOf = (d) => { const s = (d.summary || []).find((x) => /目的地|地點/.test(x.label) && !isTbd(x.value)); return s ? s.value : '' }

function Card({ row }) {
  const d = row.data || {}
  const cov = d.cover || {}
  const [bad, setBad] = useState(false)
  // 標題有「｜」就取後半做卡片主標(前半通常係日夜／地點文案,同下面摘要重複)
  const main = row.title.split(/\s*[｜|]\s*/).slice(-1)[0]
  const span = spanOf(d), dest = destOf(d)
  const meta = [span, dest].filter(Boolean).join(' · ')
  // 篩走同紫色摘要重複嘅 tag(例如「2 日 1 夜」、「深圳」;去空格比對),淨低真正標籤(親子…)
  const norm = (s) => String(s).replace(/\s/g, '')
  const tags = (cov.tags || []).filter((t) => norm(t) !== norm(span) && !(dest && norm(dest).indexOf(norm(t)) >= 0)).slice(0, 4)
  return (
    <a className="tl-card" href={'#/t/' + encodeURIComponent(row.slug)}>
      <div className="tl-thumb">
        {cov.image && !bad
          ? <img src={wikiThumb(cov.image, 560)} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setBad(true)} />
          : <div className="tl-ph"><span>{main}</span></div>}
      </div>
      <div className="tl-body">
        <h2>{main}</h2>
        {meta && <p className="tl-meta">{meta}</p>}
        {tags.length > 0 && <div className="tl-tags">{tags.map((t) => <span key={t}>{t}</span>)}</div>}
      </div>
    </a>
  )
}

export default function TripsList() {
  const [st, setSt] = useState({ s: 'loading' })
  useEffect(() => {
    let alive = true
    // 快取優先:上次睇過即時出,唔使等網絡
    try { const c = localStorage.getItem('trips:list'); if (c) setSt({ s: 'ok', rows: JSON.parse(c) }) } catch { /* ignore */ }
    ;(async () => {
      const { data, error } = await supabase
        .from('trips').select('slug,title,data,updated_at')
        .eq('published', true).order('updated_at', { ascending: false })
      if (!alive) return
      if (error) { setSt((p) => (p.s === 'ok' ? p : { s: 'error', msg: error.message })); return }
      try { localStorage.setItem('trips:list', JSON.stringify(data)) } catch { /* ignore */ }
      setSt({ s: 'ok', rows: data })
    })()
    return () => { alive = false }
  }, [])
  useEffect(() => { document.title = '精選行程' }, [])
  // 統一更新提示:有行程新增/發布/改動(published 行程嘅數目或 updated_at 變)就彈「有新版本」
  useEffect(() => watchFreshness(async () => {
    const { data } = await supabase.from('trips').select('updated_at').eq('published', true)
    if (!data) return null
    const max = data.reduce((m, r) => (r.updated_at > m ? r.updated_at : m), '')
    return { sig: data.length + '|' + max, time: max }
  }), [])

  const rows = st.s === 'ok' ? st.rows : null
  return (
    <div className="trip">
      <div className="tl-wrap">
        <div className="tl-top"><a className="tl-home" href={SITE_BASE}>‹ 首頁</a></div>
        <header className="tl-hd">
          <span className="tl-kick">旅遊行程</span>
          <h1>精選行程</h1>
          <p>一家人去過／計劃緊嘅完整行程。撳入去睇每日時間表、住宿、交通同預算。</p>
        </header>
        {st.s === 'loading' && !rows && <p className="tl-msg">載入行程中…</p>}
        {st.s === 'error' && !rows && <p className="tl-msg">載入失敗:{st.msg}</p>}
        {rows && rows.length === 0 && <p className="tl-msg">仲未有已公開嘅行程。</p>}
        {rows && rows.length > 0 && <div className="tl-grid">{rows.map((r) => <Card key={r.slug} row={r} />)}</div>}
      </div>
    </div>
  )
}
