// Register page: collects the User schema fields (firstName, lastName, email, password
// and the optional location, occupation, description) and sends them to the API.

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  // One state object holds the whole form
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    location: '',
    occupation: '',
    description: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Update only the field that changed, using the input's name attribute
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  // After a successful registration, redirect to the login page with a success message
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(form)
      navigate('/login', {
        state: { message: 'Account created successfully. Please log in.' },
      })
    } catch (err) {
      const data = err.response?.data

      setError(
        data?.errors?.join(', ') ||
        data?.message ||
        'Registration failed.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-heading">
          <span className="auth-icon">A</span>
          <p className="eyebrow">Join the community</p>
          <h1>Create Account</h1>
          <p>Start sharing your memories with Alzikrayat.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                minLength={2}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                minLength={2}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
            <small>Minimum 6 characters.</small>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Your city"
            />
          </div>

          <div className="form-group">
            <label htmlFor="occupation">Occupation</label>
            <input
              id="occupation"
              name="occupation"
              value={form.occupation}
              onChange={handleChange}
              placeholder="Your occupation"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">About You</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              placeholder="Tell us something about yourself..."
            />
          </div>

          <button
            className="btn btn-primary btn-full"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  )
}

export default Register
