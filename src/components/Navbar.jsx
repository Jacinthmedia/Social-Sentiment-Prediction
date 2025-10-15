import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setIsMobileMenuOpen(false)
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Brand Logo */}
        <div className="nav-brand">
          <Link to="/" className="brand-link" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="logo-container">
              <div className="logo-icon">⚡</div>
              <span className="brand-text">BlockDAG Analyzer</span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          {user ? (
            <>
              {/* Dashboard */}
              <Link 
                to="/dashboard" 
                className="nav-link dashboard-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="link-icon">📊</span>
                Dashboard
              </Link>
              
              {/* Profile */}
              <Link 
                to="/profile" 
                className="nav-link profile-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="link-icon">👤</span>
                Profile
              </Link>
              
              <div className="user-welcome">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="avatar" className="user-avatar-img" />
                ) : (
                  <div className="user-avatar">
                    {(user.displayName?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}
                  </div>
                )}
                <span className="welcome-text">
                  Hi, {user.displayName || user.email}
                </span>
              </div>
              
              {/* Logout */}
              <button 
                onClick={handleLogout} 
                className="logout-btn"
              >
                <span className="btn-icon">🚪</span>
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <Link 
                to="/login" 
                className="nav-link login-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="link-icon">🔑</span>
                Login
              </Link>
              
              {/* Register */}
              <Link 
                to="/register" 
                className="signup-btn"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="btn-icon">✨</span>
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar