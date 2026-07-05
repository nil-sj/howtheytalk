import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'

export default function AdminLayout() {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-sidebar-brand">How<span>TheyTalk</span><small>Admin</small></Link>
        <nav className="admin-sidebar-nav">
          <NavLink to="/admin" end>📊 Dashboard</NavLink>
          <NavLink to="/admin/entries">📖 Entries</NavLink>
          <NavLink to="/admin/entries/new">✏️ New entry</NavLink>
          <NavLink to="/admin/usage-diffs">🔄 Usage differences</NavLink>
          <NavLink to="/admin/suggest">✨ AI suggestions</NavLink>
          <NavLink to="/admin/submissions">📬 Submissions</NavLink>
          <NavLink to="/admin/analytics">📈 Analytics</NavLink>
          <NavLink to="/admin/comments">💬 Comments</NavLink>
          <NavLink to="/admin/category-metrics">📊 Category metrics</NavLink>
          <NavLink to="/admin/settings">⚙️ AI settings</NavLink>
        </nav>
        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-sidebar-link">← Public site</Link>
          <a href={`${import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022'}/admin`} target="_blank" rel="noopener" className="admin-sidebar-link">Drupal admin ↗</a>
          <button onClick={handleLogout} className="admin-logout-btn">Sign out</button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
