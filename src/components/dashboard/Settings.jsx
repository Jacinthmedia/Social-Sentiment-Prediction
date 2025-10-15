import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/AuthContext';
import './Settings.css';

const Settings = () => {
  const { user, updateUserProfile } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [recentActivity, setRecentActivity] = useState([]);

  // Intelligent settings state with validation
  const [settings, setSettings] = useState({
    profile: {
      displayName: '',
      email: '',
      bio: '',
      company: '',
      website: '',
      avatar: '',
      location: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    notifications: {
      email: { enabled: true, frequency: 'realtime' },
      push: { enabled: true, categories: ['security', 'updates'] },
      sms: { enabled: false, number: '' },
      desktop: { enabled: true },
      weeklyReports: { enabled: false, day: 'monday' },
      securityAlerts: { enabled: true, level: 'high' }
    },
    preferences: {
      theme: 'system',
      language: 'en',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      dashboardRefresh: 30,
      defaultView: 'overview',
      compactMode: false,
      animations: true,
      soundEffects: false
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      loginAlerts: true,
      deviceManagement: true,
      privacyMode: false
    },
    integrations: {
      googleAnalytics: { connected: false, trackingId: '' },
      slack: { connected: false, webhook: '' },
      zapier: { connected: false, apiKey: '' }
    }
  });

  // Dynamic sections based on user role and permissions
  const sections = [
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: '👤', 
      color: '#667eea',
      description: 'Manage your personal information',
      badge: user?.emailVerified ? 'Verified' : null
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: '🔔', 
      color: '#ed8936',
      description: 'Control how you receive alerts',
      badge: getNotificationCount()
    },
    { 
      id: 'preferences', 
      label: 'Preferences', 
      icon: '🎨', 
      color: '#38a169',
      description: 'Customize your experience'
    },
    { 
      id: 'security', 
      label: 'Security', 
      icon: '🔒', 
      color: '#e53e3e',
      description: 'Protect your account',
      badge: settings.security.twoFactor ? '2FA On' : null
    },
    { 
      id: 'integrations', 
      label: 'Integrations', 
      icon: '🔗', 
      color: '#805ad5',
      description: 'Connect third-party services',
      badge: getIntegrationCount()
    },
    { 
      id: 'advanced', 
      label: 'Advanced', 
      icon: '⚡', 
      color: '#d69e2e',
      description: 'Developer and power user options'
    }
  ];

  // Filter sections based on search
  const filteredSections = sections.filter(section =>
    section.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Initialize settings with user data
  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          displayName: user.name || user.displayName || '',
          email: user.email || '',
          avatar: user.photoURL || '',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      }));
    }
  }, [user]);

  // Load settings with intelligent defaults
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Try localStorage first
        const savedSettings = localStorage.getItem('blockdagSettings');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings(prev => ({ ...prev, ...parsed }));
        }

        // Load recent activity
        setRecentActivity([
          { id: 1, action: 'Profile updated', time: '2 hours ago', type: 'success' },
          { id: 2, action: 'Password changed', time: '1 day ago', type: 'security' },
          { id: 3, action: 'New device login', time: '3 days ago', type: 'info' }
        ]);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  // Auto-save with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('blockdagSettings', JSON.stringify(settings));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [settings]);

  // Apply theme changes immediately
  useEffect(() => {
    applyTheme(settings.preferences.theme);
  }, [settings.preferences.theme]);

  const handleSettingChange = (category, key, value, subKey = null) => {
    setSettings(prev => {
      if (subKey) {
        return {
          ...prev,
          [category]: {
            ...prev[category],
            [key]: {
              ...prev[category][key],
              [subKey]: value
            }
          }
        };
      }
      
      return {
        ...prev,
        [category]: {
          ...prev[category],
          [key]: value
        }
      };
    });

    // Log activity for important changes
    if (category === 'security' || key === 'theme' || key === 'twoFactor') {
      logActivity(`Changed ${category}.${key}`, 'settings');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateUserProfile({
        displayName: settings.profile.displayName,
        name: settings.profile.displayName,
        bio: settings.profile.bio,
        company: settings.profile.company,
        website: settings.profile.website,
        photoURL: settings.profile.avatar
      });
      
      showStatus('Profile updated successfully!', 'success');
      logActivity('Profile updated', 'success');
    } catch (error) {
      console.error('Profile update error:', error);
      showStatus('Failed to update profile. Please try again.', 'error');
      logActivity('Profile update failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkUpdate = async (updates) => {
    setIsLoading(true);
    try {
      // Simulate API call for bulk updates
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSettings(prev => ({ ...prev, ...updates }));
      showStatus('Settings updated successfully!', 'success');
    } catch (error) {
      showStatus('Failed to update settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `blockdag-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showStatus('Settings exported successfully!', 'success');
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      const defaults = {
        profile: { ...settings.profile, bio: '', company: '', website: '' },
        notifications: {
          email: { enabled: true, frequency: 'realtime' },
          push: { enabled: true, categories: ['security', 'updates'] },
          sms: { enabled: false, number: '' },
          desktop: { enabled: true },
          weeklyReports: { enabled: false, day: 'monday' },
          securityAlerts: { enabled: true, level: 'high' }
        },
        preferences: {
          theme: 'system',
          language: 'en',
          currency: 'USD',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h',
          dashboardRefresh: 30,
          defaultView: 'overview',
          compactMode: false,
          animations: true,
          soundEffects: false
        }
      };
      
      setSettings(prev => ({ ...prev, ...defaults }));
      showStatus('Settings reset to defaults!', 'success');
    }
  };

  const applyTheme = (theme) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    
    // Apply CSS variables based on theme
    if (theme === 'dark') {
      root.style.setProperty('--bg-primary', '#1a202c');
      root.style.setProperty('--text-primary', '#ffffff');
    } else {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--text-primary', '#2d3748');
    }
  };

  const showStatus = (message, type = 'info') => {
    setSaveStatus({ message, type });
    setTimeout(() => setSaveStatus(''), 4000);
  };

  const logActivity = (action, type) => {
    const activity = {
      id: Date.now(),
      action,
      time: 'Just now',
      type
    };
    setRecentActivity(prev => [activity, ...prev.slice(0, 4)]);
  };

  // Helper functions
  function getNotificationCount() {
    const enabled = Object.values(settings.notifications).filter(n => n.enabled).length;
    return `${enabled} active`;
  }

  function getIntegrationCount() {
    const connected = Object.values(settings.integrations).filter(i => i.connected).length;
    return `${connected} connected`;
  }

  return (
    <div className="dashboard-settings">
      {/* Header with Search */}
      <div className="settings-header">
        <div className="header-content">
          <h1>Smart Settings</h1>
          <p>Intelligent configuration for your BlockDAG experience</p>
        </div>
        
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search settings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="action-buttons">
            <button onClick={exportSettings} className="action-btn secondary">
              Export
            </button>
            <button onClick={resetToDefaults} className="action-btn warning">
              Reset
            </button>
          </div>
        </div>
      </div>

      {saveStatus && (
        <div className={`status-message ${saveStatus.type}`}>
          <span className="status-icon">
            {saveStatus.type === 'success' ? '✅' : 
             saveStatus.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          {saveStatus.message}
        </div>
      )}

      <div className="settings-content-wrapper">
        {/* Smart Navigation */}
        <div className="settings-navigation">
          <div className="nav-header">
            <h3>Categories</h3>
            {searchTerm && (
              <span className="results-count">
                {filteredSections.length} results
              </span>
            )}
          </div>
          
          {filteredSections.map(section => (
            <button
              key={section.id}
              className={`nav-tab ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
              style={{ '--tab-color': section.color }}
            >
              <span className="tab-icon">{section.icon}</span>
              <div className="tab-content">
                <span className="tab-label">{section.label}</span>
                <span className="tab-description">{section.description}</span>
              </div>
              {section.badge && (
                <span className="tab-badge">{section.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Content Area */}
        <div className="settings-panels">
          {/* Profile Panel */}
          {activeSection === 'profile' && (
            <ProfilePanel 
              settings={settings}
              onChange={handleSettingChange}
              onSave={handleProfileUpdate}
              isLoading={isLoading}
              user={user}
            />
          )}

          {/* Notifications Panel */}
          {activeSection === 'notifications' && (
            <NotificationsPanel 
              settings={settings}
              onChange={handleSettingChange}
            />
          )}

          {/* Preferences Panel */}
          {activeSection === 'preferences' && (
            <PreferencesPanel 
              settings={settings}
              onChange={handleSettingChange}
            />
          )}

          {/* Security Panel */}
          {activeSection === 'security' && (
            <SecurityPanel 
              settings={settings}
              onChange={handleSettingChange}
              user={user}
            />
          )}

          {/* Integrations Panel */}
          {activeSection === 'integrations' && (
            <IntegrationsPanel 
              settings={settings}
              onChange={handleSettingChange}
            />
          )}

          {/* Advanced Panel */}
          {activeSection === 'advanced' && (
            <AdvancedPanel 
              settings={settings}
              onExport={exportSettings}
              onReset={resetToDefaults}
              activity={recentActivity}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-components for better organization
const ProfilePanel = ({ settings, onChange, onSave, isLoading, user }) => (
  <div className="settings-panel">
    <div className="panel-header">
      <h2>Profile Settings</h2>
      <p>Manage your personal information and appearance</p>
    </div>
    
    <form onSubmit={onSave} className="settings-form">
      <div className="form-section">
        <h3>Basic Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Display Name</label>
            <input
              type="text"
              value={settings.profile.displayName}
              onChange={(e) => onChange('profile', 'displayName', e.target.value)}
              placeholder="Enter your display name"
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={settings.profile.email}
              disabled
              className="disabled"
            />
            {user?.emailVerified && (
              <small className="verified">✅ Email verified</small>
            )}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Additional Information</h3>
        <div className="form-group">
          <label>Bio</label>
          <textarea
            value={settings.profile.bio}
            onChange={(e) => onChange('profile', 'bio', e.target.value)}
            placeholder="Tell us about yourself..."
            rows="3"
            maxLength="200"
          />
          <div className="char-count">{settings.profile.bio.length}/200</div>
        </div>
        
        <div className="form-grid">
          <div className="form-group">
            <label>Company</label>
            <input
              type="text"
              value={settings.profile.company}
              onChange={(e) => onChange('profile', 'company', e.target.value)}
              placeholder="Your company"
            />
          </div>
          <div className="form-group">
            <label>Website</label>
            <input
              type="url"
              value={settings.profile.website}
              onChange={(e) => onChange('profile', 'website', e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        </div>
      </div>

      <button type="submit" className="save-btn" disabled={isLoading}>
        {isLoading ? (
          <>
            <span className="spinner"></span>
            Saving...
          </>
        ) : (
          'Save Profile Changes'
        )}
      </button>
    </form>
  </div>
);

const NotificationsPanel = ({ settings, onChange }) => (
  <div className="settings-panel">
    <div className="panel-header">
      <h2>Notification Preferences</h2>
      <p>Control how and when you receive notifications</p>
    </div>
    
    <div className="notification-categories">
      {Object.entries(settings.notifications).map(([key, config]) => (
        <div key={key} className="notification-item">
          <div className="notification-header">
            <div className="notification-info">
              <h4>{formatNotificationLabel(key)}</h4>
              <p>{getNotificationDescription(key)}</p>
            </div>
            <label className="toggle-switch large">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => onChange('notifications', key, { ...config, enabled: e.target.checked })}
              />
              <span className="slider"></span>
            </label>
          </div>
          
          {config.enabled && key === 'email' && (
            <div className="notification-options">
              <label>Frequency</label>
              <select 
                value={config.frequency}
                onChange={(e) => onChange('notifications', key, { ...config, frequency: e.target.value })}
              >
                <option value="realtime">Real-time</option>
                <option value="digest">Daily Digest</option>
                <option value="weekly">Weekly Summary</option>
              </select>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const PreferencesPanel = ({ settings, onChange }) => (
  <div className="settings-panel">
    <div className="panel-header">
      <h2>Appearance & Behavior</h2>
      <p>Customize how BlockDAG looks and behaves</p>
    </div>
    
    <div className="preferences-grid">
      <div className="preference-item">
        <label>Theme</label>
        <select 
          value={settings.preferences.theme}
          onChange={(e) => onChange('preferences', 'theme', e.target.value)}
        >
          <option value="system">System Default</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto (Sunrise/Sunset)</option>
        </select>
      </div>

      <div className="preference-item">
        <label>Language</label>
        <select 
          value={settings.preferences.language}
          onChange={(e) => onChange('preferences', 'language', e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="ja">日本語</option>
        </select>
      </div>

      <div className="preference-item">
        <label>Auto-refresh</label>
        <select 
          value={settings.preferences.dashboardRefresh}
          onChange={(e) => onChange('preferences', 'dashboardRefresh', parseInt(e.target.value))}
        >
          <option value={15}>15 seconds</option>
          <option value={30}>30 seconds</option>
          <option value={60}>1 minute</option>
          <option value={300}>5 minutes</option>
          <option value={0}>Manual only</option>
        </select>
      </div>

      <div className="preference-item">
        <label>Default View</label>
        <select 
          value={settings.preferences.defaultView}
          onChange={(e) => onChange('preferences', 'defaultView', e.target.value)}
        >
          <option value="overview">Overview</option>
          <option value="analytics">Analytics</option>
          <option value="reports">Reports</option>
          <option value="custom">Custom Dashboard</option>
        </select>
      </div>
    </div>

    <div className="toggle-grid">
      <div className="toggle-item">
        <div className="toggle-info">
          <span className="toggle-label">Compact Mode</span>
          <small>Use denser spacing for more content</small>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={settings.preferences.compactMode}
            onChange={(e) => onChange('preferences', 'compactMode', e.target.value)}
          />
          <span className="slider"></span>
        </label>
      </div>

      <div className="toggle-item">
        <div className="toggle-info">
          <span className="toggle-label">Animations</span>
          <small>Enable smooth transitions and effects</small>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={settings.preferences.animations}
            onChange={(e) => onChange('preferences', 'animations', e.target.value)}
          />
          <span className="slider"></span>
        </label>
      </div>

      <div className="toggle-item">
        <div className="toggle-info">
          <span className="toggle-label">Sound Effects</span>
          <small>Play sounds for notifications</small>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={settings.preferences.soundEffects}
            onChange={(e) => onChange('preferences', 'soundEffects', e.target.value)}
          />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  </div>
);

const SecurityPanel = ({ settings, onChange, user }) => (
  <div className="settings-panel">
    <div className="panel-header">
      <h2>Security Settings</h2>
      <p>Protect your account and manage access</p>
    </div>
    
    <div className="security-grid">
      <div className="security-card critical">
        <div className="security-info">
          <h4>Two-Factor Authentication</h4>
          <p>Add an extra layer of security to your account</p>
          {settings.security.twoFactor && (
            <div className="security-status active">
              ✅ Active since {new Date().toLocaleDateString()}
            </div>
          )}
        </div>
        <label className="toggle-switch large">
          <input
            type="checkbox"
            checked={settings.security.twoFactor}
            onChange={(e) => onChange('security', 'twoFactor', e.target.value)}
          />
          <span className="slider"></span>
        </label>
      </div>

      <div className="security-card">
        <div className="security-info">
          <h4>Session Timeout</h4>
          <p>Automatically log out after period of inactivity</p>
        </div>
        <select 
          value={settings.security.sessionTimeout}
          onChange={(e) => onChange('security', 'sessionTimeout', parseInt(e.target.value))}
          className="security-select"
        >
          <option value={15}>15 minutes</option>
          <option value={30}>30 minutes</option>
          <option value={60}>1 hour</option>
          <option value={240}>4 hours</option>
          <option value={0}>Never (not recommended)</option>
        </select>
      </div>

      <div className="security-card">
        <div className="security-info">
          <h4>Login Alerts</h4>
          <p>Get notified of new sign-ins from unknown devices</p>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={settings.security.loginAlerts}
            onChange={(e) => onChange('security', 'loginAlerts', e.target.value)}
          />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  </div>
);

const IntegrationsPanel = ({ settings, onChange }) => (
  <div className="settings-panel">
    <div className="panel-header">
      <h2>Integrations</h2>
      <p>Connect BlockDAG with your favorite tools</p>
    </div>
    
    <div className="integrations-grid">
      {Object.entries(settings.integrations).map(([key, config]) => (
        <div key={key} className={`integration-card ${config.connected ? 'connected' : ''}`}>
          <div className="integration-icon">
            {key === 'googleAnalytics' && '📊'}
            {key === 'slack' && '💬'}
            {key === 'zapier' && '⚡'}
          </div>
          <div className="integration-info">
            <h4>{formatIntegrationName(key)}</h4>
            <p>{getIntegrationDescription(key)}</p>
            {config.connected && (
              <div className="integration-status">
                <span className="status-dot"></span>
                Connected
              </div>
            )}
          </div>
          <button 
            className={`integration-btn ${config.connected ? 'disconnect' : 'connect'}`}
            onClick={() => onChange('integrations', key, { ...config, connected: !config.connected })}
          >
            {config.connected ? 'Disconnect' : 'Connect'}
          </button>
        </div>
      ))}
    </div>
  </div>
);

const AdvancedPanel = ({ settings, onExport, onReset, activity }) => (
  <div className="settings-panel">
    <div className="panel-header">
      <h2>Advanced Settings</h2>
      <p>Power user options and system information</p>
    </div>
    
    <div className="advanced-sections">
      <div className="advanced-section">
        <h3>Data Management</h3>
        <div className="action-buttons horizontal">
          <button onClick={onExport} className="action-btn secondary">
            📥 Export All Settings
          </button>
          <button onClick={onReset} className="action-btn warning">
            🔄 Reset to Defaults
          </button>
        </div>
      </div>

      <div className="advanced-section">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {activity.map(item => (
            <div key={item.id} className={`activity-item ${item.type}`}>
              <div className="activity-icon">
                {item.type === 'success' && '✅'}
                {item.type === 'error' && '❌'}
                {item.type === 'security' && '🔒'}
                {item.type === 'info' && 'ℹ️'}
              </div>
              <div className="activity-content">
                <p>{item.action}</p>
                <span className="activity-time">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="advanced-section">
        <h3>System Information</h3>
        <div className="system-info">
          <div className="info-item">
            <span className="info-label">App Version:</span>
            <span className="info-value">1.2.0</span>
          </div>
          <div className="info-item">
            <span className="info-label">Last Updated:</span>
            <span className="info-value">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Browser:</span>
            <span className="info-value">{navigator.userAgent.split(' ')[0]}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Helper functions
const formatNotificationLabel = (key) => {
  const labels = {
    email: 'Email Notifications',
    push: 'Push Notifications', 
    sms: 'SMS Alerts',
    desktop: 'Desktop Notifications',
    weeklyReports: 'Weekly Reports',
    securityAlerts: 'Security Alerts'
  };
  return labels[key] || key;
};

const getNotificationDescription = (key) => {
  const descriptions = {
    email: 'Receive notifications via email',
    push: 'Browser push notifications',
    sms: 'Text message alerts',
    desktop: 'System-level notifications',
    weeklyReports: 'Weekly summary reports',
    securityAlerts: 'Important security updates'
  };
  return descriptions[key] || 'Notification setting';
};

const formatIntegrationName = (key) => {
  const names = {
    googleAnalytics: 'Google Analytics',
    slack: 'Slack',
    zapier: 'Zapier'
  };
  return names[key] || key;
};

const getIntegrationDescription = (key) => {
  const descriptions = {
    googleAnalytics: 'Track website analytics and user behavior',
    slack: 'Send notifications to your Slack channels',
    zapier: 'Connect with 5000+ apps and automate workflows'
  };
  return descriptions[key] || 'Third-party integration';
};

export default Settings;