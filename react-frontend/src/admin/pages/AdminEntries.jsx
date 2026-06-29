import AdminBackButton from '../components/AdminBackButton'
import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getAdminEntries, getAdminStats } from '../api/adminDrupal'

const ADMIN_SECRET = 'talknotes-admin-2026'
const DRUPAL_BASE = import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022'

async function getDraftEntries() {
  const res = await fetch(`${DRUPAL_BASE}/api/recent-drafts?limit=50`, {
    headers: { 'X-Admin-Secret': ADMIN_SECRET }
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.drafts || []
}

function entryNid(entry) {
  // For JSON:API entries, use drupal_internal__nid not the UUID
  if (entry.attributes?.drupal_internal__nid) return entry.attributes.drupal_internal__nid
  return entry.id || ''
}
function entryTitle(entry) {
  return entry.title || entry.attributes?.title || ''
}
function entryMeaning(entry) {
  return entry.short_meaning || entry.attributes?.field_short_meaning || ''
}
function entryChanged(entry) {
  const t = entry.changed || entry.attributes?.changed
  if (!t) return ''
  const d = typeof t === 'number' ? new Date(t * 1000) : new Date(t)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function entryStatus(entry, currentFilter) {
  if (currentFilter === 'draft') return 'draft'
  return entry.attributes?.moderation_state || (entry.attributes?.status ? 'published' : 'draft')
}
function entryViewSlug(entry) {
  return entry.attributes?.path?.alias?.replace('/entries/', '') || ''
}

export default function AdminEntries() {
  const [searchParams, setSearchParams] = useSearchParams()
  const status = searchParams.get('status') || 'all'
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [stats, setStats] = useState(null)

  useEffect(() => { getAdminStats().then(setStats) }, [])

  useEffect(() => {
    setLoading(true)
    setPage(0)
    if (status === 'draft') {
      getDraftEntries().then(data => { setEntries(data); setHasMore(false); setLoading(false) })
    } else {
      getAdminEntries({ page: 0, status }).then(data => {
        setEntries(data.data || [])
        setHasMore((data.data || []).length === 20)
        setLoading(false)
      })
    }
  }, [status])

  useEffect(() => {
    if (status === 'draft' || page === 0) return
    setLoading(true)
    getAdminEntries({ page, status }).then(data => {
      setEntries(data.data || [])
      setHasMore((data.data || []).length === 20)
      setLoading(false)
    })
  }, [page])

  function tabCount(s) {
    if (!stats) return ''
    if (s === 'published') return stats.publishedEntries
    if (s === 'draft') return stats.draftEntries
    if (s === 'all') return (stats.publishedEntries || 0) + (stats.draftEntries || 0)
    return ''
  }

  function summaryText() {
    if (loading) return 'Loading...'
    const count = entries.length
    if (status === 'draft') return `${count} draft ${count === 1 ? 'entry' : 'entries'}`
    if (status === 'published') return `Showing ${page * 20 + 1}–${page * 20 + count} of ${stats?.publishedEntries ?? '?'} published entries`
    const total = (stats?.publishedEntries || 0) + (stats?.draftEntries || 0)
    return `Showing ${page * 20 + 1}–${page * 20 + count} of ${total || '?'} total entries`
  }

  return (
    <div className="admin-page"><AdminBackButton />
      <div className="admin-page-header">
        <h1>Entries</h1>
        <Link to="/admin/entries/new" className="admin-btn-primary">+ New draft</Link>
      </div>

      <div className="admin-tab-bar">
        {['all', 'draft', 'published'].map(s => (
          <button key={s}
            className={`admin-tab ${status === s ? 'admin-tab--active' : ''}`}
            onClick={() => { setSearchParams({ status: s }); setPage(0); }}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
            {stats && (
              <span className={`admin-tab-count ${status === s ? 'admin-tab-count--active' : ''}`}>
                {tabCount(s)}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="admin-entries-summary">{summaryText()}</div>

      <div className="admin-table">
        <div className="admin-table-header">
          <span>Title</span>
          <span>Status</span>
          <span>Updated</span>
          <span>Actions</span>
        </div>
        {!loading && entries.map((entry, i) => {
          const nid = entryNid(entry)
          const slug = entryViewSlug(entry)
          const modState = entryStatus(entry, status)
          return (
            <div key={i} className="admin-table-row">
              <div className="admin-table-title">
                <div>{entryTitle(entry)}</div>
                {entryMeaning(entry) && (
                  <div className="admin-table-sub">{entryMeaning(entry).slice(0, 80)}...</div>
                )}
              </div>
              <div>
                <span className={`admin-status-badge ${modState === 'published' ? 'admin-status-badge--pub' : 'admin-status-badge--draft'}`}>
                  {modState}
                </span>
              </div>
              <div className="admin-table-date">{entryChanged(entry)}</div>
              <div className="admin-table-actions">
                <Link to={`/admin/entries/${nid}/edit`} className="admin-action-link">Edit</Link>
                {slug && (
                  <a href={`https://talknotes.codenil.online/entries/${slug}`} target="_blank" rel="noopener" className="admin-action-link">View</a>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {!loading && entries.length === 0 && <div className="admin-empty">No entries found.</div>}

      {status !== 'draft' && (
        <div className="admin-pagination">
          <button className="admin-btn-ghost" onClick={() => setPage(p => p - 1)} disabled={page === 0}>← Prev</button>
          <span>Page {page + 1}</span>
          <button className="admin-btn-ghost" onClick={() => setPage(p => p + 1)} disabled={!hasMore}>Next →</button>
        </div>
      )}
    </div>
  )
}
