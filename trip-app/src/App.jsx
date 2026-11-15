import { useEffect, useState } from 'react'
import { supabase } from './supabase.js'
import Login from './Login.jsx'
import TripsAdmin from './TripsAdmin.jsx'
import TripPage, { tripSlug } from './TripPage.jsx'
import { SITE_BASE } from './site.js'

// #/t/<slug>:公開行程頁(唔使登入);#/manage:行程管理(要登入);其餘跳返網站首頁
const route = () => {
  const s = tripSlug()
  if (s) return { page: 'trip', slug: s }
  if (/^#\/manage/.test(window.location.hash)) return { page: 'manage' }
  return { page: 'home' }
}

export default function App() {
  const [r, setR] = useState(route)
  useEffect(() => {
    const f = () => setR(route())
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])
  useEffect(() => { if (r.page === 'home') window.location.replace(SITE_BASE) }, [r.page])
  if (r.page === 'trip') return <TripPage key={r.slug} slug={r.slug} />
  if (r.page === 'manage') return <Manage />
  return null
}

function Manage() {
  const [session, setSession] = useState(undefined)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])
  if (session === undefined) return <div className="center muted">載入中…</div>
  if (!session) return <Login />
  return (
    <div className="shell">
      <main className="main">
        <div className="toprow">
          <a href={SITE_BASE} className="acct" style={{ width: 'auto', padding: '0 14px', textDecoration: 'none' }}>‹ 首頁</a>
          <button className="acct" style={{ width: 'auto', padding: '0 14px' }} onClick={() => supabase.auth.signOut()}>登出</button>
        </div>
        <TripsAdmin />
      </main>
    </div>
  )
}
