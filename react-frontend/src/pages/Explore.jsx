import { Link } from 'react-router-dom'

const features = [
  { emoji: '🔄', title: 'Usage Differences', description: 'Explore pairs of words that are often confused or used interchangeably — like Rock vs Stone, House vs Home, or Borrow vs Lend. Understand the subtle but important differences.', cta: 'Browse usage differences', link: '/usage-difference', available: true, color: 'teal' },
  { emoji: '📅', title: 'Word of the Day', description: 'A new English word or phrase every day — with its meaning, usage examples, notes, and cultural context. Build your vocabulary one day at a time.', cta: "See today's word", link: '/word-of-the-day', available: true, color: 'green' },
  { emoji: '🃏', title: 'Flashcards', description: 'Practice English words and phrases with interactive flashcards. Pick a category, flip through cards, and track what you know. Uses the full TalkNotes collection.', cta: 'Practice flashcards', link: '/flashcards', available: true, color: 'purple' },
  { emoji: '🧩', title: 'Quizzes', description: 'Test your knowledge of American English with short, fun quizzes. Multiple-choice questions on idioms, vocabulary, workplace phrases, and cultural expressions.', cta: 'Take a quiz', link: '/quizzes', available: true, color: 'amber' },
  { emoji: '🎯', title: 'Hangman', description: 'The classic word-guessing game with a twist — every word comes from the TalkNotes collection. Guess the phrase letter by letter, and learn its meaning when the round ends.', cta: 'Play hangman', link: '/hangman', available: true, color: 'coral' },
]

const colorMap = {
  teal:   { bg: '#e1f5ee', border: '#5DCAA5', text: '#085041' },
  purple: { bg: '#EEEDFE', border: '#AFA9EC', text: '#26215C' },
  amber:  { bg: '#FAEEDA', border: '#EF9F27', text: '#412402' },
  green:  { bg: '#EAF3DE', border: '#97C459', text: '#173404' },
  coral:  { bg: '#FAECE7', border: '#F0997B', text: '#4A1B0C' },
}

export default function Explore() {
  return (
    <div className="explore-page">
      <div className="page-header">
        <h1 className="page-title">Explore</h1>
        <p className="page-subtitle">Go beyond reading — practice, play, and deepen your understanding of English</p>
      </div>
      <div className="explore-grid">
        {features.map(feature => {
          const colors = colorMap[feature.color]
          return (
            <div key={feature.title} className="explore-card" style={{ '--card-bg': colors.bg, '--card-border': colors.border, '--card-text': colors.text }}>
              <div className="explore-card-emoji">{feature.emoji}</div>
              <h2 className="explore-card-title">{feature.title}</h2>
              <p className="explore-card-desc">{feature.description}</p>
              <div className="explore-card-footer">
                <Link to={feature.link} className="explore-card-cta">{feature.cta} →</Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
