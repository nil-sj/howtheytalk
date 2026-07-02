import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

export default function Layout() {
  const [search, setSearch] = useState('')
  const [practiceOpen, setPracticeOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false)
  const navigate = useNavigate()
  const closeTimer = useRef(null)

  const { data: footerStats } = useQuery({
    queryKey: ['footer-stats'],
    staleTime: 30 * 60 * 1000,
    queryFn: async () => {
      const DRUPAL = import.meta.env.VITE_DRUPAL_URL || 'http://192.168.1.157:9022'
      const res = await fetch(`${DRUPAL}/api/public-stats`)
      return res.json()
    }
  })

  function handleSearch(e) {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`)
      setMobileMenuOpen(false)
    }
  }

  function openDropdown() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setPracticeOpen(true)
  }

  function closeDropdown() {
    closeTimer.current = setTimeout(() => setPracticeOpen(false), 150)
  }

  function closeAll() {
    setMobileMenuOpen(false)
    setMobileExploreOpen(false)
    setPracticeOpen(false)
  }

  useEffect(() => {
    setMobileMenuOpen(false)
    setMobileExploreOpen(false)
  }, [navigate])

  return (
    <div className="site-wrapper">
      <header className="site-header">
        <div className="container header-inner">
          <div className="site-brand">
            <Link to="/" className="site-name" onClick={closeAll}>Talk<span>Notes</span></Link>
            <p className="site-slogan">A personal English language diary</p>
          </div>

          <nav className="main-nav desktop-nav">
            <NavLink to="/entries">Entries</NavLink>
            <NavLink to="/categories">Categories</NavLink>
            <div className="nav-dropdown" onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
              <span
                className={`nav-dropdown-trigger ${practiceOpen ? 'nav-dropdown-trigger--open' : ''}`}
                onClick={() => { navigate('/explore'); setPracticeOpen(false); }}
              >
                Explore ▾
              </span>
              {practiceOpen && (
                <div className="nav-dropdown-menu" onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
                  <Link to="/articles" onClick={() => setPracticeOpen(false)}>📝 Articles</Link>
                  <Link to="/usage-difference" onClick={() => setPracticeOpen(false)}>🔄 Usage Differences</Link>
                  <Link to="/word-of-the-day" onClick={() => setPracticeOpen(false)}>📅 Word of the Day</Link>
                  <Link to="/flashcards" onClick={() => setPracticeOpen(false)}>🃏 Flashcards</Link>
                  <Link to="/quizzes" onClick={() => setPracticeOpen(false)}>🧩 Quizzes</Link>
                  <Link to="/hangman" onClick={() => setPracticeOpen(false)}>🎯 Hangman</Link>
                </div>
              )}
            </div>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>

          <form className="header-search desktop-search" onSubmit={handleSearch}>
            <input type="search" placeholder="Search everything..." value={search} onChange={e => setSearch(e.target.value)} />
            <button type="submit">Search</button>
          </form>

          <button className={`hamburger ${mobileMenuOpen ? 'hamburger--open' : ''}`} onClick={() => setMobileMenuOpen(o => !o)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            <form className="mobile-search" onSubmit={handleSearch}>
              <input type="search" placeholder="Search everything..." value={search} onChange={e => setSearch(e.target.value)} autoFocus />
              <button type="submit">Go</button>
            </form>
            <nav className="mobile-nav">
              <NavLink to="/entries" onClick={closeAll}>Entries</NavLink>
              <NavLink to="/categories" onClick={closeAll}>Categories</NavLink>
              <button className="mobile-nav-section" onClick={() => setMobileExploreOpen(o => !o)}>
                <span>Explore</span>
                <span>{mobileExploreOpen ? '▲' : '▼'}</span>
              </button>
              {mobileExploreOpen && (
                <div className="mobile-nav-submenu">
                  <Link to="/explore" onClick={closeAll}>All features</Link>
                  <Link to="/articles" onClick={closeAll}>📝 Articles</Link>
                  <Link to="/usage-difference" onClick={closeAll}>🔄 Usage Differences</Link>
                  <Link to="/word-of-the-day" onClick={closeAll}>📅 Word of the Day</Link>
                  <Link to="/flashcards" onClick={closeAll}>🃏 Flashcards</Link>
                  <Link to="/quizzes" onClick={closeAll}>🧩 Quizzes</Link>
                  <Link to="/hangman" onClick={closeAll}>🎯 Hangman</Link>
                </div>
              )}
              <NavLink to="/about" onClick={closeAll}>About</NavLink>
              <NavLink to="/contact" onClick={closeAll}>Contact</NavLink>
              <NavLink to="/search" onClick={closeAll}>Search</NavLink>
            </nav>
          </div>
        )}
      </header>

      <main className="main-content">
        <div className="container"><Outlet /></div>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-grid">
            <div className="footer-col footer-col--brand">
              <div className="footer-brand">Talk<span>Notes</span></div>
              <p className="footer-desc">A personal repository of English words, phrases, idioms, and everyday expressions — especially from the perspective of learning practical English in the United States.</p>
              <div className="footer-legal-links">
                <Link to="/privacy">Privacy policy</Link>
                <span className="footer-legal-sep">·</span>
                <Link to="/terms">Terms of use</Link>
                <span className="footer-legal-sep">·</span>
                <a href="/admin">Admin panel</a>
              </div>
            </div>
            <div className="footer-col">
              <div className="footer-heading">Browse</div>
              <ul className="footer-links">
                <li><Link to="/entries">All entries</Link></li>
                <li><Link to="/categories">Categories</Link></li>
                <li><Link to="/articles">Articles</Link></li>
                <li><Link to="/usage-difference">Usage differences</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <div className="footer-heading">Explore</div>
              <ul className="footer-links">
                <li><Link to="/word-of-the-day">Word of the Day</Link></li>
                <li><Link to="/flashcards">Flashcards</Link></li>
                <li><Link to="/quizzes">Quizzes</Link></li>
                <li><Link to="/hangman">Hangman</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <div className="footer-heading">Site</div>
              <ul className="footer-links">
                <li><Link to="/about">About</Link></li>
                <li><Link to="/search">Search</Link></li>
                <li><Link to="/contact">Suggest a word</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
          </div>
          {footerStats && (
            <div className="footer-stats-bar">
              <span>{footerStats.entries} language entries</span>
              <span className="footer-stats-sep">·</span>
              <span>{footerStats.usageDifferences} usage differences</span>
              <span className="footer-stats-sep">·</span>
              <span>{footerStats.articles} articles</span>
            </div>
          )}
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} TalkNotes — A personal English language diary</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
