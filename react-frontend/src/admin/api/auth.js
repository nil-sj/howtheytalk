const DRUPAL_BASE = import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022'

export async function login(username, password) {
  const res = await fetch(`${DRUPAL_BASE}/user/login?_format=json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: username, pass: password }),
  })
  if (!res.ok) throw new Error('Invalid credentials')
  const data = await res.json()
  const token = { csrf: data.csrf_token, logout: data.logout_token, uid: data.current_user?.uid, name: data.current_user?.name }
  localStorage.setItem('tn_admin_token', JSON.stringify(token))
  return token
}

export function getToken() {
  try { return JSON.parse(localStorage.getItem('tn_admin_token')) } catch { return null }
}

export function logout() {
  localStorage.removeItem('tn_admin_token')
  localStorage.removeItem('tn_ai_settings')
}

export function isLoggedIn() {
  return !!getToken()
}
