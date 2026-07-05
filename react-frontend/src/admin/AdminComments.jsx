import { useState, useEffect, useCallback } from 'react';
import { adminGetComments, adminUpdateComment, adminDeleteComment } from '../api/comments';

function timeAgo(timestamp) {
  const seconds = Math.floor(Date.now() / 1000 - timestamp);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return new Date(timestamp * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0, all: 0 });

  const load = useCallback(async (s) => {
    setLoading(true);
    const [pending, approved, rejected] = await Promise.all([
      adminGetComments('pending'),
      adminGetComments('approved'),
      adminGetComments('rejected'),
    ]);
    setCounts({
      pending: pending.length,
      approved: approved.length,
      rejected: rejected.length,
      all: pending.length + approved.length + rejected.length,
    });
    const map = { pending, approved, rejected, all: [...pending, ...approved, ...rejected] };
    setComments(map[s] || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(status); }, [status, load]);

  const handleStatusChange = (s) => setStatus(s);

  const handleUpdate = async (id, newStatus) => {
    await adminUpdateComment(id, newStatus);
    setComments(prev => prev.filter(c => {
      if (status === 'all') {
        return c.id !== id ? true : { ...c, status: newStatus };
      }
      return c.id !== id;
    }));
    setCounts(prev => {
      const comment = comments.find(c => c.id === id);
      if (!comment) return prev;
      const updated = { ...prev };
      updated[comment.status] = Math.max(0, updated[comment.status] - 1);
      updated[newStatus] = (updated[newStatus] || 0) + 1;
      return updated;
    });
    await load(status);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this comment permanently?')) return;
    await adminDeleteComment(id);
    await load(status);
  };

  const filters = [
    { key: 'pending',  label: `Pending (${counts.pending})` },
    { key: 'approved', label: `Approved (${counts.approved})` },
    { key: 'rejected', label: `Rejected (${counts.rejected})` },
    { key: 'all',      label: `All (${counts.all})` },
  ];

  return (
    <div className="admin-comments-page">
      <h2 style={{ marginBottom: '0.5rem' }}>Comments</h2>
      <p style={{ color: '#888', fontSize: '0.87rem', marginBottom: '1.5rem' }}>
        Review and moderate reader comments. Approved comments appear publicly on articles.
      </p>

      <div className="admin-comments-filters">
        {filters.map(f => (
          <button
            key={f.key}
            className={status === f.key ? 'active' : ''}
            onClick={() => handleStatusChange(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && <div className="comments-loading">Loading comments...</div>}

      {!loading && comments.length === 0 && (
        <div className="comments-empty">No {status === 'all' ? '' : status} comments.</div>
      )}

      {!loading && comments.map(c => (
        <div key={c.id} className="comment-card">
          <div className="comment-card-header">
            <div className="comment-card-meta">
              <span className="comment-card-name">{c.name}</span>
              <span className="comment-card-email">{c.email}</span>
              <span className="comment-card-article">📄 {c.article_title}</span>
              <span className="comment-card-time">{timeAgo(c.created)} · IP: {c.ip_address}</span>
            </div>
            <div className="comment-card-badges">
              <span className={`badge badge-${c.status}`}>{c.status}</span>
              {c.spam_score > 0 && (
                <span className="spam-score">spam score: {c.spam_score}</span>
              )}
            </div>
          </div>

          <p className="comment-card-message">{c.message}</p>

          <div className="comment-card-actions">
            {c.status !== 'approved' && (
              <button className="comment-action-btn btn-approve" onClick={() => handleUpdate(c.id, 'approved')}>
                ✓ Approve
              </button>
            )}
            {c.status !== 'rejected' && (
              <button className="comment-action-btn btn-reject" onClick={() => handleUpdate(c.id, 'rejected')}>
                ✗ Reject
              </button>
            )}
            {c.status !== 'pending' && (
              <button className="comment-action-btn btn-pending" onClick={() => handleUpdate(c.id, 'pending')}>
                ↩ Move to Pending
              </button>
            )}
            <button className="comment-action-btn btn-delete" onClick={() => handleDelete(c.id)}>
              🗑 Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
