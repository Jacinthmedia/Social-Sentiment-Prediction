import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTwitter, FaLinkedin, FaGithub, FaYoutube } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const location = useLocation();
  
  // Only show footer on landing page (home page)
  if (location.pathname !== '/') {
    return null;
  }

  return (
    <footer className="footer">
      <div className="container">
        {/* Main Footer Content */}
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-icon">⚡</span>
              <span className="logo-text">BlockDAG Analyzer</span>
            </Link>
            <p className="footer-description">
              Advanced blockchain analytics platform powered by DAG technology 
              and artificial intelligence for modern finance.
            </p>
            <div className="social-icons">
              <a href="https://twitter.com/blockdag" aria-label="Twitter">
                <FaTwitter size={20} />
              </a>
              <a href="https://www.linkedin.com/company/blockdag" aria-label="LinkedIn">
                <FaLinkedin size={20} />
              </a>
              <a href="https://github.com/blockdag" aria-label="GitHub">
                <FaGithub size={20} />
              </a>
              <a href="https://www.youtube.com/c/blockdag" aria-label="YouTube">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          <div className="footer-links-grid">
            <div className="footer-column">
              <h3>Product</h3>
              <ul className="footer-links">
                <li><Link to="/features">Features</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
                <li><Link to="/api">API</Link></li>
                <li><Link to="/integrations">Integrations</Link></li>
                <li><Link to="/changelog">Changelog</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Solutions</h3>
              <ul className="footer-links">
                <li><Link to="/traders">For Traders</Link></li>
                <li><Link to="/institutions">For Institutions</Link></li>
                <li><Link to="/developers">For Developers</Link></li>
                <li><Link to="/enterprise">Enterprise</Link></li>
                <li><Link to="/research">Research</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Resources</h3>
              <ul className="footer-links">
                <li><Link to="/documentation">Documentation</Link></li>
                <li><Link to="/tutorials">Tutorials</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/community">Community</Link></li>
                <li><Link to="/support">Support</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Company</h3>
              <ul className="footer-links">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/press">Press</Link></li>
                <li><Link to="/partners">Partners</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <h3>Stay Updated with Crypto Insights</h3>
            <p>Get the latest market analysis and platform updates delivered to your inbox.</p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="newsletter-input"
              />
              <button className="newsletter-btn">
                <span>Subscribe</span>
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; 2025 BlockDAG Analyzer. All rights reserved.</p>
            <div className="legal-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
          </div>
          
          <div className="footer-badges">
            <div className="badge">🔒 SOC 2 Compliant</div>
            <div className="badge">🌐 Global Coverage</div>
            <div className="badge">⚡ Real-time Data</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;