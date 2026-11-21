// 統一更新提示:偵測 Supabase 資料有冇更新,有就彈一個更新視窗(目前/最新 時間 + 立即更新/稍後)。
// getInfo() 回傳 {sig, time}:sig 用嚟比對有冇變;time 係顯示用嘅更新時間(ISO 字串或可給 Date)。
function fmt(v) {
  if (!v) return '—'
  const d = new Date(v)
  if (isNaN(d)) return String(v)
  const p = (n) => (n < 10 ? '0' : '') + n
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes())
}

// benka/照行 風格:置中視窗、⟳、目前/最新、立即更新/稍後
export function showUpdateModal(curTime, latestTime) {
  if (document.getElementById('upd-modal')) return
  const ov = document.createElement('div')
  ov.id = 'upd-modal'
  ov.setAttribute('role', 'alertdialog')
  ov.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:rgba(20,30,50,.4);display:flex;align-items:center;justify-content:center;padding:20px;font-family:'Noto Sans TC','PingFang TC',system-ui,sans-serif"
  const row = (k, v) => '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;background:#f1f3f7;border-radius:10px;padding:10px 14px;font-size:14px"><span style="color:#5d6780">' + k + '</span><b style="color:#152038;font-variant-numeric:tabular-nums">' + v + '</b></div>'
  const c = document.createElement('div')
  c.style.cssText = "background:#fff;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,.3);padding:24px 22px;width:300px;max-width:92vw;text-align:center"
  c.innerHTML =
    '<div style="font-size:30px;line-height:1;color:#2b4c7e;margin-bottom:10px">↻</div>' +
    '<div style="font-size:18px;font-weight:800;margin-bottom:16px;color:#152038">有新版本</div>' +
    '<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">' + row('目前', curTime) + row('最新', latestTime) + '</div>'
  const g = document.createElement('button')
  g.textContent = '立即更新'
  g.style.cssText = "display:block;width:100%;padding:12px;border:0;border-radius:12px;background:#1f4f9c;color:#fff;font:700 15px/1 inherit;cursor:pointer;margin-bottom:8px"
  g.onclick = () => location.replace(location.pathname + '?r=' + Date.now() + location.hash)
  const l = document.createElement('button')
  l.textContent = '稍後'
  l.style.cssText = "display:block;width:100%;padding:12px;border:0;border-radius:12px;background:#eef1f6;color:#5d6780;font:700 15px/1 inherit;cursor:pointer"
  l.onclick = () => ov.remove()
  c.appendChild(g); c.appendChild(l); ov.appendChild(c)
  document.body.appendChild(ov)
}

export function watchFreshness(getInfo) {
  let seen = null, seenTime = null, done = false
  const check = async () => {
    if (done || document.hidden) return
    try {
      const info = await getInfo()
      if (!info || info.sig == null) return
      if (seen === null) { seen = info.sig; seenTime = info.time; return }
      if (info.sig !== seen) { done = true; showUpdateModal(fmt(seenTime), fmt(info.time)) }
    } catch { /* 忽略網絡錯誤 */ }
  }
  const onVis = () => { if (!document.hidden) check() }
  document.addEventListener('visibilitychange', onVis)
  const id = setInterval(check, 60000)
  check()
  return () => { document.removeEventListener('visibilitychange', onVis); clearInterval(id) }
}
