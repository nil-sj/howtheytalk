import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/Layout'
import Home from './pages/Home'
import Entries from './pages/Entries'
import EntryDetail from './pages/EntryDetail'
import Categories from './pages/Categories'
import { UsageDifferences, NotFound } from './pages/UsageDifferences'
import UsageDifferenceDetail from './pages/UsageDifferenceDetail'
import Articles from './pages/Articles'
import ArticleDetail from './pages/ArticleDetail'
import Contact from './pages/Contact'
import Explore from './pages/Explore'
import Search from './pages/Search'
import WordOfDay from './pages/WordOfDay'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 2 } }
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="entries" element={<Entries />} />
            <Route path="entries/:slug" element={<EntryDetail />} />
            <Route path="categories" element={<Categories />} />
            <Route path="explore" element={<Explore />} />
            <Route path="usage-difference" element={<UsageDifferences />} />
            <Route path="usage-difference/:slug" element={<UsageDifferenceDetail />} />
            <Route path="articles" element={<Articles />} />
            <Route path="articles/:slug" element={<ArticleDetail />} />
            <Route path="contact" element={<Contact />} />
            <Route path="search" element={<Search />} />
            <Route path="word-of-the-day" element={<WordOfDay />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
