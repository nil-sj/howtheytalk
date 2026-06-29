import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Layout() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    if (search.trim()) navigate(`/entries?search=${encodeURIComponent(search.trim())}`)
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
            <NavLink to="/usage-difference">Usage Differences</NavLink>
            <NavLink to="/articles">Articles</NavLink>
            <NavLink to="/categories">Categories</NavLink>
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
        <div className="container"><p>TalkNotes — A personal English language diary</p></div>
      </footer>
    </div>
  )
}
