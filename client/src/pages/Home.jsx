// Home page: landing view with a banner, a short description of Alzikrayat
// and clear navigation buttons to the gallery and registration.

import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Home() {
  // The second button changes depending on whether the visitor is logged in
  const { isAuthenticated } = useAuth()

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">
            Your memories. Your stories.
          </span>

          <h1>
            Every picture tells a <span>beautiful story.</span>
          </h1>

          <p>
            Alzikrayat is a place to share your favorite moments,
            explore memories, and connect through photography.
          </p>

          <div className="hero-actions">
            <Link to="/gallery" className="btn btn-primary">
              Explore Gallery
            </Link>

            <Link
              to={isAuthenticated ? '/gallery' : '/register'}
              className="btn btn-secondary"
            >
              {isAuthenticated
                ? 'Discover Photos'
                : 'Join Our Community'}
            </Link>
          </div>
        </div>

        <div className="hero-decoration">
          <div className="hero-photo-frame">
            <div className="hero-photo-placeholder">
              <span>✦</span>
              <p>Moments worth remembering</p>
            </div>
          </div>
          <div className="floating-note">
            Memories live forever.
          </div>
        </div>
      </section>

      <section className="features-section page-container">
        <div className="section-heading">
          <p className="eyebrow">What you can do</p>
          <h2>Share. Explore. Remember.</h2>
        </div>

        <div className="features-grid">
          <article className="feature-card">
            <span className="feature-icon">📸</span>
            <h3>Share Photos</h3>
            <p>Upload your favorite pictures and share their stories.</p>
          </article>

          <article className="feature-card">
            <span className="feature-icon">🌍</span>
            <h3>Explore Gallery</h3>
            <p>Discover photos and moments shared by others.</p>
          </article>

          <article className="feature-card">
            <span className="feature-icon">💬</span>
            <h3>Leave Comments</h3>
            <p>Connect with the community through comments.</p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default Home
