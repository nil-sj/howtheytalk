import { Link } from 'react-router-dom'

export default function TermsOfUse() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1 className="about-title">Terms of Use</h1>
        <p className="about-lead">Last updated: June 2026</p>
      </div>
      <div className="about-body">
        <section className="about-section">
          <h2>About this site</h2>
          <p>TalkNotes is a personal, publicly accessible reference site for English words, phrases, idioms, and language observations. It is maintained by a private individual as a personal project and educational resource.</p>
        </section>

        <section className="about-section">
          <h2>Use of content</h2>
          <p>The content on TalkNotes — including word definitions, explanations, usage examples, notes, and articles — is written by the site administrator and is provided for personal educational use.</p>
          <p>You are welcome to read, reference, and share individual entries for personal, educational, or non-commercial purposes, with credit to TalkNotes (talknotes.codenil.online).</p>
          <p>You may not reproduce large portions of the site's content, scrape the site systematically, or use the content for commercial purposes without permission.</p>
        </section>

        <section className="about-section">
          <h2>Accuracy of information</h2>
          <p>TalkNotes is a personal diary and reference collection, not an authoritative academic or professional dictionary. While we strive for accuracy, entries represent personal observations and research. Language is living and evolving — usages change, regional differences exist, and not every native speaker will agree on every point.</p>
          <p>If you believe an entry contains an error, please use the <Link to="/contact">contact form</Link> to suggest a correction. We welcome and appreciate feedback.</p>
        </section>

        <section className="about-section">
          <h2>Interactive features</h2>
          <p>The Flashcards, Quizzes, Hangman, and other interactive features on this site are provided for educational entertainment. No progress is stored on our servers. All game state is temporary and local to your browser session.</p>
        </section>

        <section className="about-section">
          <h2>Contact form</h2>
          <p>The contact and suggestion form is provided for genuine communication — word suggestions, corrections, questions, and feedback. Please do not use it for spam, promotional messages, or abusive content. Submissions are reviewed by the site administrator.</p>
        </section>

        <section className="about-section">
          <h2>No warranties</h2>
          <p>This site is provided "as is" without any warranties, expressed or implied. We make no guarantees about the accuracy, completeness, or suitability of the content for any particular purpose. Use of this site is at your own discretion.</p>
        </section>

        <section className="about-section">
          <h2>External links</h2>
          <p>Some entries include links to external websites for reference or further reading. We are not responsible for the content, availability, or privacy practices of external sites.</p>
        </section>

        <section className="about-section">
          <h2>Changes to these terms</h2>
          <p>We may update these terms from time to time. Continued use of the site after updates constitutes acceptance of the revised terms.</p>
        </section>

        <section className="about-section">
          <h2>Contact</h2>
          <p>For questions about these terms, please use the <Link to="/contact">contact form</Link>.</p>
        </section>
      </div>
    </div>
  )
}
