import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">QuizMaster ⚡</Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/"            className={isActive('/')}>Browse</Link>
            <Link to="/leaderboard" className={isActive('/leaderboard')}>Leaderboard</Link>
            <Link to="/my-scores"   className={isActive('/my-scores')}>My Scores</Link>
            <span style={{ color: 'var(--muted)', fontSize: 13, padding: '0 8px' }}>
              Hi, {user.username}
            </span>
            <button className="btn btn-secondary" style={{ padding: '7px 16px' }} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login"    className="btn btn-secondary" style={{ padding: '7px 16px' }}>Login</Link>
            <Link to="/register" className="btn btn-primary"   style={{ padding: '7px 16px' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}
