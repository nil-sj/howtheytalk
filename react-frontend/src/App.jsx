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
import Flashcards from './pages/Flashcards'
import Quizzes from './pages/Quizzes'
import Hangman from './pages/Hangman'
import About from './pages/About'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfUse from './pages/TermsOfUse'
import AdminLayout from './admin/components/AdminLayout'
import AdminGuard from './admin/components/AdminGuard'
import AdminLogin from './admin/pages/AdminLogin'
import AdminDashboard from './admin/pages/AdminDashboard'
import AdminEntries from './admin/pages/AdminEntries'
import AdminNewEntry from './admin/pages/AdminNewEntry'
import AdminEditEntry from './admin/pages/AdminEditEntry'
import AdminSubmissions from './admin/pages/AdminSubmissions'
import AdminSettings from './admin/pages/AdminSettings'
import AdminSuggest from './admin/pages/AdminSuggest'
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
            <Route path="flashcards" element={<Flashcards />} />
            <Route path="quizzes" element={<Quizzes />} />
            <Route path="hangman" element={<Hangman />} />
            <Route path="about" element={<About />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsOfUse />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
            <Route index element={<AdminDashboard />} />
            <Route path="entries" element={<AdminEntries />} />
            <Route path="entries/new" element={<AdminNewEntry />} />
            <Route path="entries/:nid/edit" element={<AdminEditEntry />} />
            <Route path="submissions" element={<AdminSubmissions />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="suggest" element={<AdminSuggest />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
