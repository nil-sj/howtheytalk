import { Navigate } from 'react-router-dom'
import { isLoggedIn } from '../api/auth'

export default function AdminGuard({ children }) {
  if (!isLoggedIn()) return <Navigate to="/admin/login" replace />
  return children
}
