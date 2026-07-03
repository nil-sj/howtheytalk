import { Link } from 'react-router-dom'

export default function PrivacyPolicy() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1 className="about-title">Privacy Policy</h1>
        <p className="about-lead">Last updated: June 2026</p>
      </div>
      <div className="about-body">
        <section className="about-section">
          <h2>What information we collect</h2>
          <p>HowTheyTalk is a read-only public reference site. We do not require you to create an account or log in to use any part of the site.</p>
          <p>The only information we collect is what you voluntarily provide through the <Link to="/contact">contact and suggestion form</Link>: your name, email address, and message. This information is used solely to respond to your message or consider your suggestion. It is never sold, shared, or used for marketing purposes.</p>
        </section>

        <section className="about-section">
          <h2>Cookies and tracking</h2>
          <p>HowTheyTalk does not use advertising cookies or third-party tracking scripts. We do not run ads. We do not build profiles of visitors.</p>
          <p>The site may use basic session storage in your browser to remember your state during interactive features like Flashcards and Quizzes. This data stays in your browser and is never sent to our servers.</p>
        </section>

        <section className="about-section">
          <h2>Analytics</h2>
          <p>If analytics are used on this site, they are privacy-focused and do not collect personally identifiable information. We do not use Google Analytics or any advertising-based analytics platform.</p>
        </section>

        <section className="about-section">
          <h2>Third-party services</h2>
          <p>HowTheyTalk is hosted on a private server. Content is served through Cloudflare, which may collect basic access logs as part of its infrastructure services. Please refer to <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener">Cloudflare's privacy policy</a> for details.</p>
        </section>

        <section className="about-section">
          <h2>Children's privacy</h2>
          <p>HowTheyTalk is a general-audience educational reference site. We do not knowingly collect personal information from children under 13. If you believe a child has submitted personal information through our contact form, please contact us and we will delete it promptly.</p>
        </section>

        <section className="about-section">
          <h2>Contact submissions</h2>
          <p>When you submit the contact or suggestion form, your name, email, and message are stored in our database and sent to the site administrator by email. We use this information only to respond to your message or act on your suggestion. We do not retain this information beyond its useful purpose.</p>
          <p>To request deletion of a contact submission, email us using the same contact form with the subject "Delete my submission."</p>
        </section>

        <section className="about-section">
          <h2>Changes to this policy</h2>
          <p>We may update this privacy policy from time to time. Any changes will be posted on this page with an updated date. Continued use of the site after changes constitutes acceptance of the updated policy.</p>
        </section>

        <section className="about-section">
          <h2>Contact</h2>
          <p>If you have questions about this privacy policy, please use the <Link to="/contact">contact form</Link>.</p>
        </section>
      </div>
    </div>
  )
}
