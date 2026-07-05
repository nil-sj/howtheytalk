import { useState, useEffect } from 'react';
import { submitComment, getComments } from '../api/comments';

function timeAgo(timestamp) {
  const seconds = Math.floor(Date.now() / 1000 - timestamp);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(timestamp * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getInitial(name) {
  return name.trim().charAt(0).toUpperCase();
}

const avatarColors = ['#4f7c5a', '#5b7fa6', '#8a6d9e', '#c27a52', '#4a8a8a', '#7a7a5a'];
function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export default function CommentSection({ nid }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!nid) return;
    getComments(nid).then(c => { setComments(c); setLoading(false); });
  }, [nid]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitComment({ nid, ...form });
      if (res.success) {
        setSubmitted(true);
        setForm({ name: '', email: '', message: '' });
      } else {
        setError(res.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Unable to submit. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="comment-section">
      <div className="comment-section-header">
        <h3 className="comment-section-title">
          {loading ? 'Comments' : comments.length > 0 ? `${comments.length} Comment${comments.length !== 1 ? 's' : ''}` : 'Comments'}
        </h3>
      </div>

      {/* Approved comments */}
      {!loading && comments.length > 0 && (
        <div className="comments-list">
          {comments.map(c => (
            <div key={c.id} className="comment-item">
              <div className="comment-avatar" style={{ backgroundColor: getAvatarColor(c.name) }}>
                {getInitial(c.name)}
              </div>
              <div className="comment-body">
                <div className="comment-meta">
                  <span className="comment-author">{c.name}</span>
                  <span className="comment-time">{timeAgo(c.created)}</span>
                </div>
                <p className="comment-message">{c.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && comments.length === 0 && (
        <p className="no-comments">No comments yet — be the first to share your thoughts.</p>
      )}

      {/* Comment form */}
      <div className="comment-form-wrapper">
        <h4 className="comment-form-title">Leave a comment</h4>
        <p className="comment-form-note">Comments are reviewed before appearing publicly. Your email is never shown.</p>

        {submitted ? (
          <div className="comment-success">
            <span className="comment-success-icon">✓</span>
            <div>
              <strong>Thank you!</strong>
              <p>Your comment has been submitted and is awaiting review. It will appear here once approved.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="comment-form">
            <div className="comment-form-row">
              <div className="comment-form-field">
                <label htmlFor="comment-name">Name <span className="required">*</span></label>
                <input
                  id="comment-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  maxLength={100}
                  disabled={submitting}
                />
              </div>
              <div className="comment-form-field">
                <label htmlFor="comment-email">Email <span className="required">*</span></label>
                <input
                  id="comment-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com (not shown publicly)"
                  maxLength={200}
                  disabled={submitting}
                />
              </div>
            </div>
            <div className="comment-form-field">
              <label htmlFor="comment-message">Comment <span className="required">*</span></label>
              <textarea
                id="comment-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Share your thoughts, questions, or corrections..."
                rows={4}
                maxLength={2000}
                disabled={submitting}
              />
              <span className="char-count">{form.message.length}/2000</span>
            </div>
            {/* Honeypot */}
            <input name="website" type="text" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
            {error && <div className="comment-error">{error}</div>}
            <button type="submit" className="comment-submit-btn" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Comment'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
