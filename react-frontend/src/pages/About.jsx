import useDocumentMeta from '../hooks/useDocumentMeta'
import { Link } from 'react-router-dom'

export default function About() {
  useDocumentMeta('About', 'Learn about TalkNotes, a personal English language diary for non-native speakers learning practical American English.')
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1 className="about-title">About TalkNotes</h1>
        <p className="about-lead">
          A personal diary of English words, phrases, idioms, and everyday expressions —
          collected from real life, work, reading, and conversations.
        </p>
      </div>

      <div className="about-body">
        <section className="about-section">
          <h2>What is this?</h2>
          <p>
            TalkNotes is a personal language diary. It is a place where I collect English words,
            phrases, and expressions that I encounter in everyday American life — things I heard
            in a meeting, read in an article, or noticed someone say that made me think
            "I should write that down."
          </p>
          <p>
            It is not a dictionary. It is not a formal grammar guide. It is more like a
            carefully organized notebook — the kind you might keep if you were paying close
            attention to how language is actually used around you, rather than how textbooks
            say it should be used.
          </p>
        </section>

        <section className="about-section">
          <h2>The story behind it</h2>
          <p>
            When you learn English in one country and then move to another, you quickly
            realize that the English you learned and the English people actually speak are
            two very different things.
          </p>
          <p>
            You understand every word someone says, but somehow the meaning escapes you.
            You know what "circle back" and "take it offline" and "bandwidth" mean as individual
            words — but hearing them in a meeting for the first time, you are not quite sure
            what just happened.
          </p>
          <p>
            I started keeping notes. A word here, a phrase there. The story behind an idiom.
            The difference between two words I had been using interchangeably. A workplace
            expression that everyone seemed to understand but that no textbook had ever
            prepared me for.
          </p>
          <p>
            Eventually, those notes became this site.
          </p>
        </section>

        <section className="about-section">
          <h2>Who is it for?</h2>
          <p>TalkNotes is especially useful for:</p>
          <ul>
            <li>
              <strong>Immigrants and newcomers</strong> who are learning practical American
              English — not just grammar, but the real expressions people use at work, at
              school, at the store, and in conversation.
            </li>
            <li>
              <strong>People from India</strong> navigating the differences between Indian
              English and American English — expressions that are perfectly natural in one
              context but confusing or unusual in another.
            </li>
            <li>
              <strong>Non-native English speakers</strong> who want to understand idioms,
              cultural references, workplace language, and the stories behind phrases they
              keep hearing.
            </li>
            <li>
              <strong>Anyone curious about language</strong> — the etymology of everyday
              words, the cultural context behind expressions, and the fascinating ways that
              language changes and travels.
            </li>
          </ul>
        </section>

        <section className="about-section">
          <h2>How it is organized</h2>
          <p>
            Entries are organized into categories based on why the word or phrase is
            worth knowing. Business Lingo for workplace expressions. American Lingo for
            everyday American speech. Tales and Origins for phrases with interesting stories.
            Indian English vs American English for cross-cultural differences. And more.
          </p>
          <p>
            Beyond reading, you can also practice with <Link to="/flashcards">Flashcards</Link>,
            test yourself with <Link to="/quizzes">Quizzes</Link>, play
            <Link to="/hangman"> Hangman</Link> with real entries, browse
            <Link to="/usage-difference"> Usage Differences</Link> for common confusions,
            and discover a new word every day with the <Link to="/word-of-the-day">Word of the Day</Link>.
          </p>
        </section>

        <section className="about-section">
          <h2>A living collection</h2>
          <p>
            TalkNotes is not finished. It grows as I encounter new words and phrases,
            revisit old ones, and notice things worth writing down. If you come across
            something that should be here — or if you spot an error, have a correction,
            or want to suggest a phrase — please use the
            <Link to="/contact"> contact form</Link>. I read every message.
          </p>
        </section>

        <div className="about-cta-row">
          <Link to="/entries" className="btn-primary">Browse all entries</Link>
          <Link to="/categories" className="btn-secondary">Explore categories</Link>
          <Link to="/contact" className="btn-secondary">Suggest a word</Link>
        </div>
      </div>
    </div>
  )
}
