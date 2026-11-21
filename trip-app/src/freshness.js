// 統一更新提示:偵測 Supabase 資料有冇更新,有就喺頁底彈「有新版本 撳我更新」。
// getSig() 回傳代表「目前資料版本」嘅字串(例如 updated_at);第一次設為基準,
// 之後(切返 tab / 定時)再查,如同基準唔同就彈提示,撳一下即刷新。
function showToast() {
  if (document.getElementById('fresh-toast')) return
  const b = document.createElement('div')
  b.id = 'fresh-toast'
  b.setAttribute('role', 'status')
  b.style.cssText = "position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:999999;display:flex;align-items:center;gap:10px;max-width:92vw;padding:12px 14px 12px 18px;background:#152038;color:#fff;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.3);font:600 14px/1.3 'Noto Sans TC','PingFang TC',system-ui,sans-serif"
  const t = document.createElement('span'); t.textContent = '🔄 有新版本'; t.style.whiteSpace = 'nowrap'
  const g = document.createElement('button'); g.textContent = '撳我更新'
  g.style.cssText = "padding:7px 15px;border:0;border-radius:99px;background:#7b3dc4;color:#fff;font:700 14px/1 inherit;cursor:pointer;white-space:nowrap"
  g.onclick = () => location.reload()
  const x = document.createElement('span'); x.textContent = '×'; x.style.cssText = "cursor:pointer;opacity:.55;font-size:20px;line-height:1;padding:0 2px"
  x.onclick = () => b.remove()
  b.append(t, g, x)
  document.body.appendChild(b)
}

export function watchFreshness(getSig) {
  let seen = null, done = false
  const check = async () => {
    if (done || document.hidden) return
    try {
      const s = await getSig()
      if (s == null) return
      if (seen === null) { seen = s; return }
      if (s !== seen) { done = true; showToast() }
    } catch { /* 忽略網絡錯誤 */ }
  }
  const onVis = () => { if (!document.hidden) check() }
  document.addEventListener('visibilitychange', onVis)
  const id = setInterval(check, 180000)
  check()
  return () => { document.removeEventListener('visibilitychange', onVis); clearInterval(id) }
}
