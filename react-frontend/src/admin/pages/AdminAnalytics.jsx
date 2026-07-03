import AdminBackButton from '../components/AdminBackButton'
import { useState, useEffect } from 'react'
const DRUPAL_BASE = import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022'

const UMAMI_BASE = 'https://analytics.codenil.online'
const WEBSITE_ID = 'b1a3e48a-27ac-41e1-abf8-7d1ee7d94339'
const UMAMI_USER = 'admin'

function getRange(days) {
  const end = Date.now()
  const start = end - days * 24 * 60 * 60 * 1000
  return { startAt: start, endAt: end }
}

function getUmamiSettings() {
  try { return JSON.parse(localStorage.getItem('tn_umami') || '{}') } catch { return {} }
}
function saveUmamiSettings(s) { localStorage.setItem('tn_umami', JSON.stringify(s)) }

export default function AdminAnalytics() {
  const [token, setToken] = useState(getUmamiSettings().token || '')
  const [password, setPassword] = useState('')
  const [logging, setLogging] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [days, setDays] = useState(30)
  const [stats, setStats] = useState(null)
  const [pages, setPages] = useState([])
  const [referrers, setReferrers] = useState([])
  const [devices, setDevices] = useState([])
  const [browsers, setBrowsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    setLogging(true); setLoginError('')
    try {
      const res = await fetch(`${UMAMI_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: UMAMI_USER, password })
      })
      const data = await res.json()
      if (!data.token) throw new Error('Login failed')
      setToken(data.token)
      saveUmamiSettings({ token: data.token })
      setPassword('')
    } catch (err) { setLoginError(err.message) }
    setLogging(false)
  }

  async function umamiGet(path) {
    const res = await fetch(`${UMAMI_BASE}${path}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.status === 401) { setToken(''); saveUmamiSettings({}); throw new Error('Session expired — please log in again') }
    if (!res.ok) throw new Error(`API error ${res.status}`)
    return res.json()
  }

  async function loadData() {
    if (!token) return
    setLoading(true); setError('')
    const { startAt, endAt } = getRange(days)
    const base = `/api/websites/${WEBSITE_ID}`
    const q = `?startAt=${startAt}&endAt=${endAt}`
    const q10 = `${q}&limit=10`

    try {
      const [statsData, pagesData, refData, deviceData, browserData] = await Promise.all([
        umamiGet(`${base}/stats${q}`),
        umamiGet(`${base}/metrics${q10}&type=path`),
        umamiGet(`${base}/metrics${q10}&type=referrer`),
        umamiGet(`${base}/metrics${q10}&type=device`),
        umamiGet(`${base}/metrics${q10}&type=browser`),
      ])
      setStats(statsData)
      // Silently store total pageviews in Drupal for public footer display
      const pvCount = typeof statsData?.pageviews === 'object'
        ? (statsData.pageviews?.value ?? statsData.pageviews?.sum ?? 0)
        : (statsData?.pageviews || 0)
      if (pvCount > 0) {
        fetch(`${DRUPAL_BASE}/api/save-pageviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Admin-Secret': 'talknotes-admin-2026' },
          body: JSON.stringify({ pageviews: pvCount }),
        }).catch(() => {}) // silent — don't break analytics if this fails
      }
      setPages(pagesData || [])
      setReferrers(refData || [])
      setDevices(deviceData || [])
      setBrowsers(browserData || [])
    } catch (err) { setError(err.message) }
    setLoading(false)
  }

  useEffect(() => { if (token) loadData() }, [token, days])

  function fmt(n) { return (n || 0).toLocaleString() }
  function pct(a, b) { return b ? Math.round((a / b) * 100) + '%' : '0%' }
  function maxVal(arr) { return Math.max(...arr.map(i => i.y || 0), 1) }

  if (!token) return (
    <div className="admin-page">
      <AdminBackButton />
      <div className="admin-page-header"><h1>Analytics</h1></div>
      <div className="admin-analytics-login">
        <h2>Connect to Umami</h2>
        <p>Enter your Umami admin password to load analytics data.</p>
        {loginError && <div className="admin-error">{loginError}</div>}
        <div className="admin-field" style={{maxWidth:'320px'}}>
          <label>Umami password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} autoFocus />
        </div>
        <button className="admin-btn-primary" onClick={handleLogin} disabled={logging || !password}>
          {logging ? 'Connecting...' : 'Connect'}
        </button>
        <p style={{marginTop:'1rem',fontSize:'0.8rem',color:'var(--ink-faint)'}}>
          Token is saved in your browser for this session. <a href={UMAMI_BASE} target="_blank" rel="noopener">Open full Umami dashboard ↗</a>
        </p>
      </div>
    </div>
  )

  return (
    <div className="admin-page">
      <AdminBackButton />
      <div className="admin-page-header">
        <h1>Analytics</h1>
        <div style={{display:'flex', gap:'0.75rem', alignItems:'center', flexWrap:'wrap'}}>
          {['7', '30', '90'].map(d => (
            <button key={d} className={`admin-tab ${days == d ? 'admin-tab--active' : ''}`}
              onClick={() => setDays(Number(d))}>
              {d}d
            </button>
          ))}
          <button className="admin-btn-ghost" onClick={loadData} disabled={loading}>↻ Refresh</button>
          <a href={UMAMI_BASE} target="_blank" rel="noopener" className="admin-btn-ghost">Full dashboard ↗</a>
          <button className="admin-btn-ghost" onClick={() => { setToken(''); saveUmamiSettings({}) }}
            style={{fontSize:'0.75rem', color:'var(--ink-faint)'}}>Disconnect</button>
        </div>
      </div>

      {error && <div className="admin-error" style={{marginBottom:'1rem'}}>{error}</div>}
      {loading && <div className="admin-loading">Loading analytics...</div>}

      {stats && !loading && (
        <>
          <div className="admin-analytics-stats">
            {[
              { label: 'Pageviews', value: fmt(stats.pageviews) },
              { label: 'Unique visitors', value: fmt(stats.visitors) },
              { label: 'Visits', value: fmt(stats.visits) },
              { label: 'Bounce rate', value: stats.visits ? pct(stats.bounces, stats.visits) : '—' },
            ].map(s => (
              <div key={s.label} className="admin-stat-card">
                <div className="admin-stat-value">{s.value}</div>
                <div className="admin-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="admin-analytics-grid">
            <div className="admin-panel">
              <div className="admin-panel-header"><h2>Top pages</h2></div>
              {pages.length === 0 ? <div className="admin-empty">No data yet</div> : (
                <div className="admin-analytics-list">
                  {pages.slice(0, 10).map((p, i) => (
                    <div key={i} className="admin-analytics-row">
                      <div className="admin-analytics-bar-wrap">
                        <span className="admin-analytics-label" title={p.x}>{p.x || '/'}</span>
                        <div className="admin-analytics-bar" style={{width: pct(p.y, maxVal(pages))}} />
                      </div>
                      <span className="admin-analytics-count">{fmt(p.y)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="admin-panel">
              <div className="admin-panel-header"><h2>Referrers</h2></div>
              {referrers.length === 0 ? <div className="admin-empty">No referrer data yet</div> : (
                <div className="admin-analytics-list">
                  {referrers.slice(0, 10).map((r, i) => (
                    <div key={i} className="admin-analytics-row">
                      <div className="admin-analytics-bar-wrap">
                        <span className="admin-analytics-label">{r.x || 'Direct'}</span>
                        <div className="admin-analytics-bar admin-analytics-bar--ref" style={{width: pct(r.y, maxVal(referrers))}} />
                      </div>
                      <span className="admin-analytics-count">{fmt(r.y)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="admin-panel">
              <div className="admin-panel-header"><h2>Devices</h2></div>
              {devices.length === 0 ? <div className="admin-empty">No data yet</div> : (
                <div className="admin-analytics-list">
                  {devices.map((d, i) => (
                    <div key={i} className="admin-analytics-row">
                      <div className="admin-analytics-bar-wrap">
                        <span className="admin-analytics-label">{d.x || 'Unknown'}</span>
                        <div className="admin-analytics-bar admin-analytics-bar--device" style={{width: pct(d.y, maxVal(devices))}} />
                      </div>
                      <span className="admin-analytics-count">{fmt(d.y)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="admin-panel">
              <div className="admin-panel-header"><h2>Browsers</h2></div>
              {browsers.length === 0 ? <div className="admin-empty">No data yet</div> : (
                <div className="admin-analytics-list">
                  {browsers.map((b, i) => (
                    <div key={i} className="admin-analytics-row">
                      <div className="admin-analytics-bar-wrap">
                        <span className="admin-analytics-label">{b.x || 'Unknown'}</span>
                        <div className="admin-analytics-bar admin-analytics-bar--browser" style={{width: pct(b.y, maxVal(browsers))}} />
                      </div>
                      <span className="admin-analytics-count">{fmt(b.y)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {!loading && !error && !stats && (
        <div className="admin-empty">No analytics data yet. Once visitors start arriving, data will appear here.</div>
      )}
    </div>
  )
}
