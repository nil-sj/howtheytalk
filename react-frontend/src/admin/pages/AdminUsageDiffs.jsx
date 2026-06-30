import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AdminBackButton from '../components/AdminBackButton'

const DRUPAL_BASE = import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022'
const ADMIN_SECRET = 'talknotes-admin-2026'

async function fetchList(status = 'all') {
  const res = await fetch(`${DRUPAL_BASE}/api/list-usage-diffs?status=${status}`, {
    headers: { 'X-Admin-Secret': ADMIN_SECRET }
  })
  const data = await res.json()
  return data.entries || []
}

export default function AdminUsageDiffs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const status = searchParams.get('status') || 'all'
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const DRUPAL = DRUPAL_BASE

  useEffect(() => {
    setLoading(true)
    fetchList(status).then(data => { setEntries(data); setLoading(false) })
  }, [status])

  const published = entries.filter(e => e.status === 'published').length
  const drafts = entries.filter(e => e.status === 'draft').length

  function tabCount(s) {
    if (s === 'all') return entries.length
    if (s === 'published') return published
    if (s === 'draft') return drafts
    return ''
  }

  const filtered = status === 'all' ? entries
    : entries.filter(e => e.status === status)

  return (
    <div className="admin-page">
      <AdminBackButton />
      <div className="admin-page-header">
        <h1>Usage Differences</h1>
        <Link to="/admin/usage-diffs/new" className="admin-btn-primary">+ New</Link>
      </div>

      <div className="admin-tab-bar">
        {['all', 'published', 'draft'].map(s => (
          <button key={s} className={`admin-tab ${status === s ? 'admin-tab--active' : ''}`}
            onClick={() => setSearchParams({ status: s })}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
            <span className={`admin-tab-count ${status === s ? 'admin-tab-count--active' : ''}`}>
              {tabCount(s)}
            </span>
          </button>
        ))}
      </div>

      <div className="admin-entries-summary">
        {loading ? 'Loading...' : `${filtered.length} ${status === 'all' ? 'total' : status} entries`}
      </div>

      <div className="admin-table">
        <div className="admin-table-header">
          <span>Title</span>
          <span>Status</span>
          <span>Updated</span>
          <span>Actions</span>
        </div>
        {!loading && filtered.map(entry => (
          <div key={entry.nid} className="admin-table-row">
            <div className="admin-table-title">
              <div>{entry.title}</div>
              {entry.quick_summary && (
                <div className="admin-table-sub">{entry.quick_summary.slice(0, 80)}...</div>
              )}
            </div>
            <div>
              <span className={`admin-status-badge ${entry.status === 'published' ? 'admin-status-badge--pub' : 'admin-status-badge--draft'}`}>
                {entry.status}
              </span>
            </div>
            <div className="admin-table-date">
              {new Date(entry.changed * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="admin-table-actions">
              <Link to={`/admin/usage-diffs/${entry.nid}/edit`} className="admin-action-link">Edit</Link>
              {entry.status === 'published' && (
                <a href={`https://talknotes.codenil.online/usage-difference/${entry.title.toLowerCase().replace(/ vs /g, '-vs-').replace(/\s+/g, '-')}`}
                  target="_blank" rel="noopener" className="admin-action-link">View</a>
              )}
            </div>
          </div>
        ))}
      </div>
      {!loading && filtered.length === 0 && <div className="admin-empty">No entries found.</div>}
    </div>
  )
}
