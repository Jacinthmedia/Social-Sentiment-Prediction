import React, { useState, useEffect } from 'react';
import { Home, BarChart2, Users, Briefcase, FileText, Settings as IconSettings, Bell, Search, HelpCircle, User as IconUser, DollarSign, PieChart, MessageSquare } from 'lucide-react';
import { useAuth } from '../utils/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import PredictStakeWinAnalytics from '../components/dashboard/analytics/PredictStakeWinAnalytics';
import Settings from '../components/dashboard/Settings'; 
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile open state

  // prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [timeFilter, setTimeFilter] = useState('Last 7 days');

  // Mock data
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      revenue: 0,
      conversionRate: 0,
      activeProjects: 0
    },
    recentActivity: [],
    performanceMetrics: {},
    teamMembers: []
  });

  useEffect(() => {
    // Simulate API calls
    const loadDashboardData = async () => {
      setTimeout(() => {
        setDashboardData({
          stats: {
            totalUsers: 1248,
            revenue: 45280,
            conversionRate: 23.5,
            activeProjects: 18
          },
          recentActivity: [
            { id: 1, type: 'user', action: 'signed up', user: 'John Doe', time: '2 min ago', read: false },
            { id: 2, type: 'payment', action: 'completed', amount: '$299', time: '1 hour ago', read: false },
            { id: 3, type: 'project', action: 'created', project: 'Website Redesign', time: '3 hours ago', read: true },
            { id: 4, type: 'support', action: 'ticket resolved', ticket: '#2891', time: '5 hours ago', read: true }
          ],
          performanceMetrics: {
            traffic: { current: 12450, previous: 9820, trend: 'up' },
            engagement: { current: 68, previous: 72, trend: 'down' },
            sales: { current: 234, previous: 198, trend: 'up' },
            satisfaction: { current: 4.8, previous: 4.6, trend: 'up' }
          },
          teamMembers: [
            { id: 1, name: 'Sarah Johnson', role: 'Project Manager', avatar: 'SJ', status: 'online', tasks: 12 },
            { id: 2, name: 'Mike Chen', role: 'Developer', avatar: 'MC', status: 'online', tasks: 8 },
            { id: 3, name: 'Emma Davis', role: 'Designer', avatar: 'ED', status: 'away', tasks: 5 },
            { id: 4, name: 'Alex Rodriguez', role: 'Marketing', avatar: 'AR', status: 'offline', tasks: 15 }
          ]
        });

        setNotifications([
          { id: 1, title: 'New message from Sarah', message: 'Please review the project proposal', time: '10 min ago', type: 'message', read: false },
          { id: 2, title: 'Payment received', message: 'Invoice #INV-2023-2891 has been paid', time: '1 hour ago', type: 'payment', read: false },
          { id: 3, title: 'System update', message: 'Scheduled maintenance tonight at 2 AM', time: '3 hours ago', type: 'system', read: true }
        ]);
      }, 1000);
    };

    loadDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
    setUnreadNotifications(Math.max(0, unreadNotifications - 1));
  };

  const quickActions = [
    { icon: '📊', label: 'Analytics', path: '/analytics', color: '#4361ee', description: 'View detailed reports' },
    { icon: '👥', label: 'Users', path: '/users', color: '#10b981', description: 'Manage user accounts' },
    { icon: '💼', label: 'Projects', path: '/projects', color: '#f59e0b', description: 'Track projects' },
    { icon: '💰', label: 'Billing', path: '/billing', color: '#8b5cf6', description: 'Payment and invoices' },
    { icon: '⚙️', label: 'Settings', path: '/settings', color: '#64748b', description: 'System configuration' },
    { icon: '📋', label: 'Reports', path: '/reports', color: '#ef4444', description: 'Generate reports' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Performance metrics data based on time filter
  const getPerformanceData = () => {
    const baseData = {
      'Last 7 days': [65, 80, 60, 75, 90, 85, 70],
      'Last 30 days': [45, 60, 55, 70, 65, 80, 75, 72, 68, 65, 70, 75, 80, 82, 78, 75, 72, 70, 68, 65, 70, 75, 80, 85, 82, 78, 75, 80, 85, 90],
      'Last 90 days': Array.from({length: 90}, () => Math.floor(Math.random() * 40) + 50)
    };
    
    return baseData[timeFilter] || baseData['Last 7 days'];
  };

  // Get user initials for fallback avatar
  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  // Render different content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <PredictStakeWinAnalytics />;

      case 'settings':          
        return <Settings />;

      case 'users':
        return (
          <div className={styles.tabContent}>
            <h2>Users Management</h2>
            <p>User management interface coming soon...</p>
          </div>
        );

      case 'projects':
        return (
          <div className={styles.tabContent}>
            <h2>Projects</h2>
            <p>Project management interface coming soon...</p>
          </div>
        );

      case 'reports':
        return (
          <div className={styles.tabContent}>
            <h2>Reports</h2>
            <p>Reports interface coming soon...</p>
          </div>
        );
      
      case 'overview':
      default:
        return (
          <>
            {/* Welcome Section - Updated with Google Profile Picture */}
            <div className={styles.welcomeSection}>
              <div className={styles.welcomeContent}>
                <div className={styles.welcomeUser}>
                  <div className={styles.userAvatarLarge}>
                    {user?.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName}
                        className={styles.avatarImage}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={styles.avatarFallback}
                      style={{ display: user?.photoURL ? 'none' : 'flex' }}
                    >
                      {getInitials(user?.displayName)}
                    </div>
                    {user?.provider === 'google' && (
                      <div className={styles.googleBadge}>
                        <span className={styles.googleIcon}>G</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.welcomeText}>
                    <h1>Welcome back! 👋</h1>
                    <p>Here's what's happening with your BlockDAG analytics today.</p>
                    <div className={styles.userInfoBadge}>
                      <span className={styles.accountType}>
                        {user?.provider === 'google' ? 'Google Account' : 'Email Account'}
                      </span>
                      {user?.emailVerified && (
                        <span className={styles.verifiedBadge}>✓ Verified</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.welcomeActions}>
                <button className={`${styles.btn} ${styles.btnPrimary}`}>
                  <span className={styles.btnIcon}>+</span>
                  New Project
                </button>
                <button className={`${styles.btn} ${styles.btnSecondary}`}>
                  <span className={styles.btnIcon}>📥</span>
                  Export Report
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <h3>Total Users</h3>
                  <span className={styles.statIcon}>👥</span>
                </div>
                <div className={styles.statValue}>{dashboardData.stats.totalUsers.toLocaleString()}</div>
                <div className={`${styles.statTrend} ${styles.positive}`}>
                  <span className={styles.trendIcon}>📈</span>
                  <span>12.5% from last month</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <h3>Revenue</h3>
                  <span className={styles.statIcon}>💰</span>
                </div>
                <div className={styles.statValue}>{formatCurrency(dashboardData.stats.revenue)}</div>
                <div className={`${styles.statTrend} ${styles.positive}`}>
                  <span className={styles.trendIcon}>📈</span>
                  <span>8.3% from last month</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <h3>Conversion Rate</h3>
                  <span className={styles.statIcon}>📊</span>
                </div>
                <div className={styles.statValue}>{dashboardData.stats.conversionRate}%</div>
                <div className={`${styles.statTrend} ${styles.negative}`}>
                  <span className={styles.trendIcon}>📉</span>
                  <span>2.1% from last month</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <h3>Active Projects</h3>
                  <span className={styles.statIcon}>💼</span>
                </div>
                <div className={styles.statValue}>{dashboardData.stats.activeProjects}</div>
                <div className={`${styles.statTrend} ${styles.positive}`}>
                  <span className={styles.trendIcon}>📈</span>
                  <span>3 new this week</span>
                </div>
              </div>
            </div>

            {/* Charts and Metrics Section */}
            <div className={styles.metricsSection}>
              <div className={styles.metricsGrid}>
                <div className={`${styles.metricCard} ${styles.large}`}>
                  <div className={styles.metricHeader}>
                    <h3>Performance Metrics</h3>
                    <select 
                      className={styles.timeFilter} 
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                    >
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Last 90 days</option>
                    </select>
                  </div>
                  <div className={styles.metricChart}>
                    <div className={styles.chartPlaceholder}>
                      <div className={styles.chartBars}>
                        {getPerformanceData().map((height, index) => (
                          <div 
                            key={index} 
                            className={styles.chartBar} 
                            style={{ height: `${height}%` }}
                            onMouseEnter={(e) => {
                              e.target.classList.add(styles.hovered);
                              const tooltip = document.createElement('div');
                              tooltip.className = styles.chartTooltip;
                              tooltip.textContent = `${height}%`;
                              e.target.appendChild(tooltip);
                            }}
                            onMouseLeave={(e) => {
                              e.target.classList.remove(styles.hovered);
                              const tooltip = e.target.querySelector(`.${styles.chartTooltip}`);
                              if (tooltip) tooltip.remove();
                            }}
                          ></div>
                        ))}
                      </div>
                      <div className={styles.chartLabels}>
                        {timeFilter === 'Last 7 days' ? (
                          <>
                            <span>Mon</span>
                            <span>Tue</span>
                            <span>Wed</span>
                            <span>Thu</span>
                            <span>Fri</span>
                            <span>Sat</span>
                            <span>Sun</span>
                          </>
                        ) : timeFilter === 'Last 30 days' ? (
                          Array.from({length: 6}, (_, i) => (
                            <span key={i}>Week {i+1}</span>
                          ))
                        ) : (
                          Array.from({length: 6}, (_, i) => (
                            <span key={i}>Month {i+1}</span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.metricCard}>
                  <div className={styles.metricHeader}>
                    <h3>Team Activity</h3>
                    <span className={styles.teamStatus}>4 members</span>
                  </div>
                  <div className={styles.teamList}>
                    {dashboardData.teamMembers.map(member => (
                      <div key={member.id} className={styles.teamMember}>
                        <div className={styles.memberAvatar}>
                          <div className={styles.avatarCircle}>
                            {member.avatar}
                          </div>
                          <span 
                            className={styles.statusIndicator}
                            style={{ 
                              backgroundColor: member.status === 'online' ? '#10b981' : 
                                            member.status === 'away' ? '#f59e0b' : '#64748b' 
                            }}
                          ></span>
                        </div>
                        <div className={styles.memberInfo}>
                          <span className={styles.memberName}>{member.name}</span>
                          <span className={styles.memberRole}>{member.role}</span>
                        </div>
                        <div className={styles.memberTasks}>
                          <span className={styles.taskCount}>{member.tasks} tasks</span>
                          <div className={styles.taskProgress}>
                            <div 
                              className={styles.progressFill} 
                              style={{ width: `${Math.min(100, (member.tasks / 15) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity & Quick Stats */}
            <div className={styles.activitySection}>
              <div className={styles.activityGrid}>
                <div className={styles.activityCard}>
                  <div className={styles.cardHeader}>
                    <h3>Recent Activity</h3>
                    <Link to="/activity" className={styles.viewAll}>View All</Link>
                  </div>
                  <div className={styles.activityList}>
                    {dashboardData.recentActivity.map(activity => (
                      <div key={activity.id} className={styles.activityItem}>
                        <div className={styles.activityIcon}>
                          {activity.type === 'user' && '👤'}
                          {activity.type === 'payment' && '💰'}
                          {activity.type === 'project' && '💼'}
                          {activity.type === 'support' && '🔧'}
                        </div>
                        <div className={styles.activityContent}>
                          <p>
                            <strong>{activity.user || activity.project || activity.ticket}</strong> 
                            {' '}{activity.action}
                            {activity.amount && ` for ${activity.amount}`}
                          </p>
                          <span className={styles.activityTime}>{activity.time}</span>
                        </div>
                        {!activity.read && <div className={styles.unreadDot}></div>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.quickStatsCard}>
                  <div className={styles.cardHeader}>
                    <h3>System Status</h3>
                    <span className={`${styles.statusBadge} ${styles.good}`}>All Systems Operational</span>
                  </div>
                  <div className={styles.systemStats}>
                    <div className={styles.systemStat}>
                      <span className={styles.statLabel}>CPU Usage</span>
                      <div className={styles.statProgress}>
                        <div className={styles.progressBar} style={{ width: '65%' }}></div>
                      </div>
                      <span className={styles.statValue}>65%</span>
                    </div>
                    <div className={styles.systemStat}>
                      <span className={styles.statLabel}>Memory</span>
                      <div className={styles.statProgress}>
                        <div className={styles.progressBar} style={{ width: '42%' }}></div>
                      </div>
                      <span className={styles.statValue}>42%</span>
                    </div>
                    <div className={styles.systemStat}>
                      <span className={styles.statLabel}>Disk Space</span>
                      <div className={styles.statProgress}>
                        <div className={styles.progressBar} style={{ width: '78%' }}></div>
                      </div>
                      <span className={styles.statValue}>78%</span>
                    </div>
                    <div className={styles.systemStat}>
                      <span className={styles.statLabel}>Uptime</span>
                      <span className={`${styles.statValue} ${styles.good}`}>99.9%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className={styles.dashboard}>
      {/* Top Navigation Bar */}
      <nav className={styles.topNav}>
        <div className={styles.navContent}>
          <div className={styles.navLeft}>
            <button 
              className={styles.sidebarToggle}
              onClick={() => {
                // on mobile we open overlay sidebar, on desktop we collapse
                if (window.innerWidth < 768) setSidebarOpen(v => !v);
                else setSidebarCollapsed(v => !v);
              }}
              aria-label="Toggle sidebar"
              aria-expanded={sidebarOpen}
            >
              <span className={styles.hamburgerLine}></span>
              <span className={styles.hamburgerLine}></span>
              <span className={styles.hamburgerLine}></span>
            </button>
            <div className={styles.brand} aria-hidden>
              <strong>BlockDAG</strong>
            </div>
          </div>

          <div className={styles.navCenter}>
            <div className={styles.breadcrumb}>
              <span className={styles.breadcrumbRoot}>Dashboard</span>
              <span className={styles.breadcrumbDivider}>/</span>
              <span className={styles.breadcrumbCurrent}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
            </div>
          </div>

          <div className={styles.navRight}>
            <div className={styles.navActions}>
              {/* Overview shortcut in the navbar */}
              <button
                className={`${styles.navActionBtn} ${activeTab === 'overview' ? styles.active : ''}`}
                title="Overview"
                onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
                aria-pressed={activeTab === 'overview'}
                aria-label="Overview"
              >
                <Home className={styles.svgIcon} />
                <span className={styles.navActionLabel}>Overview</span>
              </button>
              <button className={styles.navActionBtn} title="Search" aria-label="Search">
                <Search className={styles.svgIcon} />
              </button>
              
              <div className={styles.notificationDropdown}>
                <button className={styles.navActionBtn} title="Notifications" aria-label="Notifications">
                  <Bell className={styles.svgIcon} />
                  {unreadNotifications > 0 && (
                    <span className={styles.notificationBadge}>{unreadNotifications}</span>
                  )}
                </button>
                <div className={styles.notificationPanel}>
                  <div className={styles.notificationHeader}>
                    <h3>Notifications</h3>
                    <span className={styles.notificationCount}>{unreadNotifications} unread</span>
                  </div>
                  <div className={styles.notificationList}>
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`${styles.notificationItem} ${notification.read ? styles.read : styles.unread}`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className={styles.notificationIcon}>
                          {notification.type === 'message' && '💬'}
                          {notification.type === 'payment' && '💰'}
                          {notification.type === 'system' && '⚙️'}
                        </div>
                        <div className={styles.notificationContent}>
                          <h4>{notification.title}</h4>
                          <p>{notification.message}</p>
                          <span className={styles.notificationTime}>{notification.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.notificationFooter}>
                    <Link to="/notifications">View All Notifications</Link>
                  </div>
                </div>
              </div>

              <button className={styles.navActionBtn} title="Help" aria-label="Help">
                <HelpCircle className={styles.svgIcon} />
              </button>
            </div>

            {/* Updated User Menu with Google Profile Picture */}
            <div className={styles.userMenu}>
              <div className={styles.userAvatar} title={user?.displayName || user?.email}>
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user?.displayName || 'User avatar'}
                    className={styles.userAvatarImage}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={styles.userAvatarFallback}
                  style={{ display: user?.photoURL ? 'none' : 'flex' }}
                >
                  {getInitials(user?.displayName)}
                </div>
              </div>
              {/* hide user name visually; keep accessible label via title on avatar */}
              <div className={styles.userDropdown}>
                <Link to="/profile">Profile</Link>
                <Link to="/settings.jsx">Settings</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* mobile overlay when sidebarOpen */}
      <div className={`${styles.sidebarOverlay} ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)} aria-hidden={!sidebarOpen}></div>

      <div className={styles.dashboardContainer}>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''} ${sidebarOpen ? styles.open : ''}`}>
          <div className={styles.sidebarHeader}>
            <h2>⚡ BlockDAG</h2>
            <button className={styles.closeSidebar} onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">✕</button>
          </div>

          <nav className={styles.sidebarNav}>
            <button 
              className={`${styles.navItem} ${activeTab === 'overview' ? styles.active : ''}`}
              onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
            >
              <Home className={styles.svgIcon} />
              <span className={styles.navLabel}>Overview</span>
            </button>
            
            <button 
              className={`${styles.navItem} ${activeTab === 'analytics' ? styles.active : ''}`}
              onClick={() => { setActiveTab('analytics'); setSidebarOpen(false); }}
            >
              <BarChart2 className={styles.svgIcon} />
              <span className={styles.navLabel}>Analytics</span>
            </button>
            
            <button 
              className={`${styles.navItem} ${activeTab === 'users' ? styles.active : ''}`}
              onClick={() => { setActiveTab('users'); setSidebarOpen(false); }}
            >
              <Users className={styles.svgIcon} />
              <span className={styles.navLabel}>Users</span>
              <span className={styles.navBadge}>1.2k</span>
            </button>
            
            <button 
              className={`${styles.navItem} ${activeTab === 'projects' ? styles.active : ''}`}
              onClick={() => { setActiveTab('projects'); setSidebarOpen(false); }}
            >
              <Briefcase className={styles.svgIcon} />
              <span className={styles.navLabel}>Projects</span>
              <span className={styles.navBadge}>18</span>
            </button>
            
            <button 
              className={`${styles.navItem} ${activeTab === 'reports' ? styles.active : ''}`}
              onClick={() => { setActiveTab('reports'); setSidebarOpen(false); }}
            >
              <FileText className={styles.svgIcon} />
              <span className={styles.navLabel}>Reports</span>
            </button>
            
            <button 
              className={`${styles.navItem} ${activeTab === 'settings' ? styles.active : ''}`}
              onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
            >
              <IconSettings className={styles.svgIcon} />
              <span className={styles.navLabel}>Settings</span>
            </button>
          </nav>

          <div className={styles.sidebarFooter}>
            <div className={styles.quickActions}>
              <h3>Quick Actions</h3>
              <div className={styles.actionGrid}>
                {quickActions.map((action, index) => (
                  <Link 
                    key={index}
                    to={action.path}
                    className={styles.actionCard}
                    style={{ '--action-color': action.color }}
                  >
                    <div className={styles.actionIcon} style={{ backgroundColor: action.color }}>
                      {action.icon}
                    </div>
                    <div className={styles.actionContent}>
                      <span className={styles.actionLabel}>{action.label}</span>
                      <span className={styles.actionDesc}>{action.description}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;