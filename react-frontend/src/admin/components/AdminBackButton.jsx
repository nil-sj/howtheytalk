import { useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'

const DRUPAL_BASE = import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022'

export default function AdminBackButton({ to = '/admin', label = 'Dashboard' }) {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="admin-mobile-bar">
      <button className="admin-mob-btn" onClick={() => navigate(to)}>
        <span className="admin-mob-icon">←</span>
        <span className="admin-mob-label">Back</span>
      </button>
      <a href="/" target="_blank" rel="noopener" className="admin-mob-btn">
        <span className="admin-mob-icon">🌐</span>
        <span className="admin-mob-label">Site</span>
      </a>
      <a href={`${DRUPAL_BASE}/admin`} target="_blank" rel="noopener" className="admin-mob-btn">
        <span className="admin-mob-icon">🔧</span>
        <span className="admin-mob-label">More</span>
      </a>
      <button className="admin-mob-btn" onClick={handleLogout}>
        <span className="admin-mob-icon">🚪</span>
        <span className="admin-mob-label">Exit</span>
      </button>
    </div>
  )
}
