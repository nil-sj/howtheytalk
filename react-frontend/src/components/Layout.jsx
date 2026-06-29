import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'

export default function Layout() {
  const [search, setSearch] = useState('')
  const [practiceOpen, setPracticeOpen] = useState(false)
  const navigate = useNavigate()
  const closeTimer = useRef(null)

  function handleSearch(e) {
    e.preventDefault()
    if (search.trim()) navigate(`/entries?search=${encodeURIComponent(search.trim())}`)
  }

  function openDropdown() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setPracticeOpen(true)
  }

  function closeDropdown() {
    closeTimer.current = setTimeout(() => setPracticeOpen(false), 150)
  }

  return (
    <div className="site-wrapper">
      <header className="site-header">
        <div className="container header-inner">
          <div className="site-brand">
            <Link to="/" className="site-name">Talk<span>Notes</span></Link>
            <p className="site-slogan">A personal English language diary</p>
          </div>
          <nav className="main-nav">
            <NavLink to="/entries">Entries</NavLink>
            <NavLink to="/categories">Categories</NavLink>
            <div className="nav-dropdown" onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
              <NavLink to="/explore" className="nav-dropdown-trigger-link" onClick={() => setPracticeOpen(false)}>
                <button className="nav-dropdown-trigger">Explore ▾</button>
              </NavLink>
              {practiceOpen && (
                <div className="nav-dropdown-menu" onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
                  <Link to="/usage-difference" onClick={() => setPracticeOpen(false)}>🔄 Usage Differences</Link>
                  <span className="nav-dropdown-soon">🃏 Flashcards <span className="coming-soon">soon</span></span>
                  <span className="nav-dropdown-soon">🧩 Quizzes <span className="coming-soon">soon</span></span>
                  <span className="nav-dropdown-soon">📅 Word of the Day <span className="coming-soon">soon</span></span>
                  <span className="nav-dropdown-soon">🎯 Hangman <span className="coming-soon">soon</span></span>
                </div>
              )}
            </div>
            <NavLink to="/articles">Articles</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>
          <form className="header-search" onSubmit={handleSearch}>
            <input type="search" placeholder="Search entries..." value={search} onChange={e => setSearch(e.target.value)} />
            <button type="submit">Search</button>
          </form>
        </div>
      </header>

      <main className="main-content">
        <div className="container"><Outlet /></div>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-brand">Talk<span>Notes</span></div>
              <p className="footer-desc">A personal repository of English words, phrases, idioms, and everyday expressions — especially from the perspective of learning practical English in the United States.</p>
            </div>
            <div className="footer-col">
              <div className="footer-heading">Browse</div>
              <ul className="footer-links">
                <li><Link to="/entries">All entries</Link></li>
                <li><Link to="/categories">Categories</Link></li>
                <li><Link to="/articles">Articles</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <div className="footer-heading">Explore</div>
              <ul className="footer-links">
                <li><Link to="/usage-difference">Usage differences</Link></li>
                <li><Link to="/explore">Flashcards <span style={{fontSize:'0.7rem',color:'var(--ink-faint)'}}>soon</span></Link></li>
                <li><Link to="/explore">Quizzes <span style={{fontSize:'0.7rem',color:'var(--ink-faint)'}}>soon</span></Link></li>
                <li><Link to="/explore">Word of the Day <span style={{fontSize:'0.7rem',color:'var(--ink-faint)'}}>soon</span></Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <div className="footer-heading">Site</div>
              <ul className="footer-links">
                <li><Link to="/contact">Suggest a word</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><a href="https://talknotes-app.codenil.online/user/login" target="_blank" rel="noopener">Admin login</a></li>
                <li><a href="https://talknotes-app.codenil.online" target="_blank" rel="noopener">Drupal site</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>TalkNotes — A personal English language diary</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
