const DRUPAL_URL = import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022';
const ADMIN_SECRET = 'talknotes-admin-2026';

export async function submitComment({ nid, name, email, message }) {
  const res = await fetch(`${DRUPAL_URL}/api/comments/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nid, name, email, message, website: '' }),
  });
  return res.json();
}

export async function getComments(nid) {
  const res = await fetch(`${DRUPAL_URL}/api/comments?nid=${nid}`);
  const data = await res.json();
  return data.comments || [];
}

export async function adminGetComments(status = 'pending') {
  const res = await fetch(`${DRUPAL_URL}/api/admin/comments?status=${status}`, {
    headers: { 'X-Admin-Secret': ADMIN_SECRET },
  });
  const data = await res.json();
  return data.comments || [];
}

export async function adminUpdateComment(id, status) {
  const res = await fetch(`${DRUPAL_URL}/api/admin/comments/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Secret': ADMIN_SECRET },
    body: JSON.stringify({ id, status }),
  });
  return res.json();
}

export async function adminDeleteComment(id) {
  const res = await fetch(`${DRUPAL_URL}/api/admin/comments/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Secret': ADMIN_SECRET },
    body: JSON.stringify({ id }),
  });
  return res.json();
}
