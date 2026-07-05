import AdminBackButton from '../components/AdminBackButton'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdminStats, getRecentDrafts } from '../api/adminDrupal'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [drafts, setDrafts] = useState([])
  const DRUPAL = import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022'

  useEffect(() => {
    getAdminStats().then(setStats)
    getRecentDrafts().then(setDrafts)
  }, [])

  const quickActions = [
    { icon: '✏️', title: 'New draft entry', desc: 'Quick capture with AI drafting', to: '/admin/entries/new' },
    { icon: '✨', title: 'AI content suggestions', desc: 'Get new entry ideas based on what you have', to: '/admin/suggest' },
    { icon: '📖', title: 'All entries', desc: 'Browse, filter and edit entries', to: '/admin/entries' },
    { icon: '🔄', title: 'Usage differences', desc: 'Manage word comparison entries', to: '/admin/usage-diffs' },
    { icon: '💬', title: 'Comments', desc: 'Review and approve reader comments', to: '/admin/comments' },
    { icon: '📬', title: 'Contact submissions', desc: 'View word suggestions and messages', to: '/admin/submissions' },
    { icon: '⚙️', title: 'AI settings', desc: 'Configure API provider and keys', to: '/admin/settings' },
    { icon: '📈', title: 'View analytics', desc: 'Pageviews, top pages, visitors', to: '/admin/analytics' },
    { icon: '🗂️', title: 'Full content management', desc: 'Edit, revise, manage in Drupal', href: `${DRUPAL}/admin/content` },
  ]

  return (
    <div className="admin-page">
      <AdminBackButton to="/admin" label="☰ Menu — Dashboard" />
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <Link to="/admin/entries/new" className="admin-btn-primary">+ New draft entry</Link>
      </div>

      <div className="admin-stats-grid">
        {[
          { label: 'Published entries', value: stats?.publishedEntries ?? '…', to: '/admin/entries?status=published' },
          { label: 'Draft entries', value: stats?.draftEntries ?? '…', to: '/admin/entries?status=draft' },
          { label: 'Usage differences', value: stats?.usageDifferences ?? '…', to: '/admin/usage-diffs' },
          { label: 'Articles', value: stats?.articles ?? '…', href: `${DRUPAL}/admin/content` },
        ].map(s => s.to ? (
          <Link key={s.label} to={s.to} className="admin-stat-card">
            <div className="admin-stat-value">{s.value}</div>
            <div className="admin-stat-label">{s.label}</div>
          </Link>
        ) : (
          <a key={s.label} href={s.href} target="_blank" rel="noopener" className="admin-stat-card">
            <div className="admin-stat-value">{s.value}</div>
            <div className="admin-stat-label">{s.label}</div>
          </a>
        ))}
      </div>

      <div className="admin-dashboard-grid">
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h2>Recent drafts</h2>
            <Link to="/admin/entries?status=draft" className="admin-panel-link">View all</Link>
          </div>
          {drafts.length === 0 && <p className="admin-empty">No drafts.</p>}
          <div className="admin-draft-list">
            {drafts.map(d => (
              <div key={d.id} className="admin-draft-item">
                <div className="admin-draft-title">{d.title}</div>
                {d.short_meaning && <div className="admin-draft-meaning">{d.short_meaning}</div>}
                <div className="admin-draft-meta">
                  {new Date(d.changed * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  <Link to={`/admin/entries/${d.id}/edit`} className="admin-draft-edit">Edit →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header"><h2>Quick actions</h2></div>
          <div className="admin-quick-actions">
            {quickActions.map(a => a.to ? (
              <Link key={a.title} to={a.to} className="admin-quick-action">
                <span className="admin-qa-icon">{a.icon}</span>
                <div>
                  <div className="admin-qa-title">{a.title}</div>
                  <div className="admin-qa-desc">{a.desc}</div>
                </div>
              </Link>
            ) : (
              <a key={a.title} href={a.href} target="_blank" rel="noopener" className="admin-quick-action">
                <span className="admin-qa-icon">{a.icon}</span>
                <div>
                  <div className="admin-qa-title">{a.title}</div>
                  <div className="admin-qa-desc">{a.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
