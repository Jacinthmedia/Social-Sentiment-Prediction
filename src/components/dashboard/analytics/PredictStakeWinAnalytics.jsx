import React, { useState, useEffect } from 'react';
import { FaChartLine, FaCoins, FaTrophy, FaRocket, FaSync, FaFire } from 'react-icons/fa';
import './PredictStakeWinAnalytics.css';

const PredictStakeWinAnalytics = () => {
  const [activeTab, setActiveTab] = useState('predict');
  const [isAnimating, setIsAnimating] = useState(false);

  // Fixed: Use icon names instead of components in the data
  const analyticsData = {
    predict: {
      title: "Market Predictions",
      metric: "87%",
      subtitle: "Accuracy Rate",
      change: "+5.2%",
      description: "Your prediction performance is exceeding market averages",
      stats: [
        { label: "Total Predictions", value: "1,247", icon: 'chart' },
        { label: "Active Predictions", value: "23", icon: 'fire' },
        { label: "Win Streak", value: "8 days", icon: 'rocket' }
      ]
    },
    stake: {
      title: "Staking Rewards",
      metric: "$2,458",
      subtitle: "Total Earned",
      change: "+12.7%",
      description: "Your staked assets are generating consistent returns",
      stats: [
        { label: "Total Staked", value: "5,000 BDAG", icon: 'coins' },
        { label: "APY", value: "15.8%", icon: 'sync' },
        { label: "Next Reward", value: "in 2 days", icon: 'trophy' }
      ]
    },
    win: {
      title: "Winning Performance",
      metric: "94%",
      subtitle: "Success Rate",
      change: "+3.1%",
      description: "You're in the top 5% of predictors this month",
      stats: [
        { label: "Total Wins", value: "384", icon: 'trophy' },
        { label: "Biggest Win", value: "$12,450", icon: 'rocket' },
        { label: "Avg. Return", value: "3.2x", icon: 'chart' }
      ]
    }
  };

  const currentData = analyticsData[activeTab];

  // Icon mapping function
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'chart': return <FaChartLine />;
      case 'coins': return <FaCoins />;
      case 'trophy': return <FaTrophy />;
      case 'rocket': return <FaRocket />;
      case 'sync': return <FaSync />;
      case 'fire': return <FaFire />;
      default: return <FaChartLine />;
    }
  };

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <div className="predict-stake-win-analytics">
      {/* Header Section */}
      <div className="psw-header">
        <div className="psw-title">
          <h2>PREDICT, STAKE & WIN</h2>
          <p>Turn the edge of your predictions into crypto rewards. Stake, predict, and win on the future of markets.</p>
        </div>
        <div className="psw-badge">
          <FaRocket className="badge-icon" />
          <span>Live Trading</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="psw-tabs">
        {['predict', 'stake', 'win'].map((tab) => (
          <button
            key={tab}
            className={`psw-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            <span className="tab-icon">
              {tab === 'predict' && <FaChartLine />}
              {tab === 'stake' && <FaCoins />}
              {tab === 'win' && <FaTrophy />}
            </span>
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Main Analytics Card */}
      <div className={`psw-main-card ${isAnimating ? 'animating' : ''}`}>
        <div className="psw-metric-section">
          <div className="metric-display">
            <div className="metric-value">{currentData.metric}</div>
            <div className="metric-subtitle">{currentData.subtitle}</div>
            <div className="metric-change positive">
              <FaChartLine /> {currentData.change}
            </div>
          </div>
          <div className="metric-chart">
            <div className="chart-visual">
              {[30, 60, 45, 80, 65, 90, 75].map((height, index) => (
                <div
                  key={index}
                  className="chart-bar"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="psw-description">
          <p>{currentData.description}</p>
        </div>
      </div>

      {/* Stats Grid - FIXED: Use getIconComponent function */}
      <div className="psw-stats-grid">
        {currentData.stats.map((stat, index) => (
          <div key={index} className="psw-stat-card">
            <div className="stat-icon">
              {getIconComponent(stat.icon)}
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="psw-actions">
        <button className="psw-cta-button">
          <FaRocket />
          Start Predicting Now
        </button>
        <button className="psw-secondary-button">
          View Leaderboard
        </button>
      </div>

      {/* Live Activity Feed */}
      <div className="psw-activity-feed">
        <h4>Live Activity</h4>
        <div className="activity-items">
          {[
            "User_123 just won 250 BDAG on BTC prediction",
            "New prediction market: ETH-USD 24h movement",
            "Staking rewards distributed to 1,452 users",
            "Top predictor this week: CryptoWhale (+$8,240)"
          ].map((activity, index) => (
            <div key={index} className="activity-item">
              <FaFire className="activity-icon" />
              <span>{activity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictStakeWinAnalytics;