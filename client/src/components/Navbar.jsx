// Navbar (toolbar): shows "Hi <firstName>" + Logout when logged in,
// and a "Please Login" link when logged out.

import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  // Logout clears the session, then returns to the home page
  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // isAuthenticated comes from AuthContext and decides which toolbar to show
  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-icon">A</span>
        Alzikrayat
      </Link>

      <nav className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/gallery">Gallery</NavLink>

        {isAuthenticated ? (
          <>
            <span className="welcome-user">
              Hi {user?.firstName}
            </span>

            <button
              type="button"
              className="nav-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className="nav-login">
            Please Login
          </NavLink>
        )}
      </nav>
    </header>
  )
}

export default Navbar
