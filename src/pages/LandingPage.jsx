import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import Footer from '../components/Footer';

const LandingPage = () => {
  useEffect(() => {
    // Header scroll effect
    const handleScroll = () => {
      const header = document.getElementById('header');
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    // Smooth scrolling for anchor links
    const handleAnchorClick = (e) => {
      const href = e.currentTarget.getAttribute('href');
      
      if (href.startsWith('#')) {
        e.preventDefault();
        
        const targetId = href;
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(anchor => {
      anchor.addEventListener('click', handleAnchorClick);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      anchorLinks.forEach(anchor => {
        anchor.removeEventListener('click', handleAnchorClick);
      });
    };
  }, []);

  return (
    <div className="landing-page">
      {/* Header */}

      <header id="header" className="header">
        <div className="container">
          <nav className="navbar">
            <Link to="/" className="logo">
              <span className="logo-icon">⚡</span>
              <span className="logo-text">BlockDAG Analyzer</span>
            </Link>
            <ul className="nav-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#pricing">Pricing</a></li>
            </ul>
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary">Sign In</Link>
              <Link to="/register" className="btn btn-primary">Get Started Free</Link>
            </div>
          </nav>
        </div>
      </header>

{/* Hero Section */}
<section className="hero">
  <div className="container">
    <div className="hero-grid">
      {/* Left Content */}
      <div className="hero-content">
        <div className="content-wrapper">
          <div className="badge">
            <span className="badge-text">AI-Powered Analytics Platform</span>
            <div className="badge-glow"></div>
          </div>
          
          <h1 className="hero-title">
            Advanced Blockchain Analytics for 
            <span className="title-accent"> Modern Finance</span>
          </h1>
          
          <p className="hero-description">
            Leverage cutting-edge DAG technology and machine learning to gain unprecedented insights into cryptocurrency markets, social sentiment, and investment opportunities.
          </p>
          
          <div className="cta-section">
            <Link to="/register" className="cta-button primary">
              <span className="button-icon">⚡</span>
              Start Free Trial
              <div className="button-shine"></div>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Visual */}
      <div className="hero-visual">
        <div className="crypto-dashboard">
          {/* Crypto Tabs */}
          <div className="crypto-tabs">
            <div className="tab active" data-crypto="btc">
              <span className="crypto-icon">₿</span>
              <span className="crypto-name">BTC</span>
              <div className="tab-indicator"></div>
            </div>
            <div className="tab" data-crypto="eth">
              <span className="crypto-icon">⧫</span>
              <span className="crypto-name">ETH</span>
              <div className="tab-indicator"></div>
            </div>
            <div className="tab" data-crypto="sol">
              <span className="crypto-icon">◎</span>
              <span className="crypto-name">SOL</span>
              <div className="tab-indicator"></div>
            </div>
            <div className="tab" data-crypto="ada">
              <span className="crypto-icon">Α</span>
              <span className="crypto-name">ADA</span>
              <div className="tab-indicator"></div>
            </div>
          </div>

{/* Price Chart - Area Style */}
<div className="chart-container">
  <div className="chart-grid">
    <div className="grid-line"></div>
    <div className="grid-line"></div>
    <div className="grid-line"></div>
  </div>
  <div className="price-path">
    <svg viewBox="0 0 400 120" className="chart-svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path 
        d="M0,100 C50,80 100,120 150,90 C200,60 250,110 300,70 C350,30 400,80 400,50 L400,120 L0,120 Z" 
        fill="url(#areaGradient)"
      />
      <path 
        d="M0,100 C50,80 100,120 150,90 C200,60 250,110 300,70 C350,30 400,80 400,50" 
        stroke="#6366f1"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  </div>
</div>

          {/* Metrics Grid */}
          <div className="metrics-showcase">
            <div className="metric-item">
              <div className="metric-value">+5.2%</div>
              <div className="metric-label">24h Change</div>
              <div className="metric-trend up">↑</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">$845B</div>
              <div className="metric-label">Market Cap</div>
              <div className="metric-trend stable">→</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">1.2M</div>
              <div className="metric-label">Transactions</div>
              <div className="metric-trend up">↑</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Stats Bar */}
    <div className="stats-bar">
      <div className="stat-card">
        <div className="stat-icon">👥</div>
        <div className="stat-content">
          <div className="stat-number">50K+</div>
          <div className="stat-title">ACTIVE USERS</div>
        </div>
        <div className="stat-glow"></div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">🎯</div>
        <div className="stat-content">
          <div className="stat-number">99.9%</div>
          <div className="stat-title">ACCURACY RATE</div>
        </div>
        <div className="stat-glow"></div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">🌐</div>
        <div className="stat-content">
          <div className="stat-number">24/7</div>
          <div className="stat-title">REAL-TIME DATA</div>
        </div>
        <div className="stat-glow"></div>
      </div>
    </div>
  </div>

  {/* Background Elements */}
  <div className="hero-bg-elements">
    <div className="floating-orb orb-1"></div>
    <div className="floating-orb orb-2"></div>
    <div className="floating-orb orb-3"></div>
    <div className="grid-pattern"></div>
  </div>
</section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Features</div>
            <h2>Enterprise-Grade Blockchain Analytics</h2>
            <p>Our platform combines DAG technology with advanced AI to deliver unparalleled market insights</p>
          </div>
          <div className="features-grid">
            <FeatureCard 
              icon="📊"
              title="Real-time Market Analysis"
              description="Monitor cryptocurrency markets with millisecond precision using our advanced DAG-based data processing engine."
            />
            <FeatureCard 
              icon="🤖"
              title="AI-Powered Predictions"
              description="Leverage machine learning models trained on billions of data points for accurate market trend forecasting."
            />
            <FeatureCard 
              icon="🔒"
              title="Secure & Compliant"
              description="Enterprise-grade security with SOC 2 compliance and end-to-end encryption for all your data."
            />
            <FeatureCard 
              icon="🌐"
              title="Multi-Chain Support"
              description="Analyze data across multiple blockchain networks including Bitcoin, Ethereum, Solana, and more."
            />
            <FeatureCard 
              icon="📈"
              title="Advanced Charting"
              description="Professional-grade technical analysis tools with customizable indicators and drawing tools."
            />
            <FeatureCard 
              icon="⚡"
              title="High Performance"
              description="Process millions of transactions per second with our optimized DAG architecture."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Process</div>
            <h2>How BlockDAG Analyzer Works</h2>
            <p>Three simple steps to transform your blockchain analytics strategy</p>
          </div>
          <div className="process-steps">
            <ProcessStep 
              number="01"
              title="Connect Your Data Sources"
              description="Integrate with exchanges, wallets, and blockchain networks through our secure API connections."
              icon="🔗"
            />
            <ProcessStep 
              number="02"
              title="AI Analysis & Processing"
              description="Our algorithms process data in real-time, identifying patterns and generating actionable insights."
              icon="🧠"
            />
            <ProcessStep 
              number="03"
              title="Get Actionable Insights"
              description="Receive comprehensive reports, alerts, and recommendations directly to your dashboard."
              icon="💡"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Testimonials</div>
            <h2>Trusted by Industry Leaders</h2>
            <p>See how top financial institutions and traders use our platform</p>
          </div>
          <div className="testimonials-grid">
            <TestimonialCard 
              content="BlockDAG Analyzer has transformed our trading strategy. The AI predictions have consistently outperformed our traditional analysis methods."
              author="Sarah Chen"
              position="Head of Quantitative Research, FinTech Corp"
              avatar="SC"
              rating={5}
            />
            <TestimonialCard 
              content="The real-time DAG processing allows us to make decisions faster than our competitors. This platform is a game-changer for high-frequency trading."
              author="Marcus Rodriguez"
              position="CTO, Crypto Hedge Fund"
              avatar="MR"
              rating={5}
            />
            <TestimonialCard 
              content="As a blockchain researcher, I appreciate the depth of analysis and accuracy of the predictions. The platform has become essential for our work."
              author="Dr. Emily Watson"
              position="Blockchain Research Director"
              avatar="EW"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Revolutionize Your Blockchain Analytics?</h2>
            <p>Join thousands of professionals who trust BlockDAG Analyzer for their critical investment decisions.</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                <span className="btn-icon">🚀</span>
                Start Your Free Trial
              </Link>
              <Link to="/login" className="btn btn-secondary btn-large">
                <span className="btn-icon">📞</span>
                Schedule a Demo
              </Link>
            </div>
            <div className="cta-features">
              <div className="feature-item">
                <span className="check-icon">✅</span>
                <span>No credit card required</span>
              </div>
              <div className="feature-item">
                <span className="check-icon">✅</span>
                <span>14-day free trial</span>
              </div>
              <div className="feature-item">
                <span className="check-icon">✅</span>
                <span>Full platform access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Component for Feature Cards
const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-card">
    <div className="feature-icon">
      <span className="icon">{icon}</span>
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
    <div className="feature-link">
      <span>Learn more</span>
      <span className="arrow">→</span>
    </div>
  </div>
);

// Component for Process Steps
const ProcessStep = ({ number, title, description, icon }) => (
  <div className="process-step">
    <div className="step-header">
      <div className="step-number">{number}</div>
      <div className="step-icon">{icon}</div>
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

// Component for Testimonial Cards
const TestimonialCard = ({ content, author, position, avatar, rating }) => (
  <div className="testimonial-card">
    <div className="testimonial-rating">
      {[...Array(rating)].map((_, i) => (
        <span key={i} className="star">⭐</span>
      ))}
    </div>
    <div className="testimonial-content">
      "{content}"
    </div>
    <div className="testimonial-author">
      <div className="author-avatar">
        <span>{avatar}</span>
      </div>
      <div className="author-info">
        <h4>{author}</h4>
        <p>{position}</p>
      </div>
    </div>
  </div>
);




export default LandingPage;