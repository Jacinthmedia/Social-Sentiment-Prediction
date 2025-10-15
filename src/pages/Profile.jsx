import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    company: '',
    jobTitle: '',
    twitter: '',
    linkedin: '',
    github: ''
  });

  // Mock user data
  const [userStats, setUserStats] = useState({
    projectsCompleted: 0,
    tasksCompleted: 0,
    teamMembers: 0,
    satisfactionRate: 0,
    weeklyActivity: [],
    skills: []
  });

  useEffect(() => {
    // Load user data
    setProfileData({
      name: user?.name || 'John Doe',
      email: user?.email || 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      bio: 'Senior Product Designer with 8+ years of experience creating beautiful and functional user interfaces. Passionate about design systems and user experience.',
      location: 'San Francisco, CA',
      website: 'johndoe.design',
      company: 'TechCorp Inc.',
      jobTitle: 'Senior Product Designer',
      twitter: '@johndoe',
      linkedin: 'linkedin.com/in/johndoe',
      github: 'github.com/johndoe'
    });

    // Load user stats
    setUserStats({
      projectsCompleted: 47,
      tasksCompleted: 1289,
      teamMembers: 12,
      satisfactionRate: 4.8,
      weeklyActivity: [65, 80, 60, 75, 90, 85, 70],
      skills: [
        { name: 'UI/UX Design', level: 95, color: '#4361ee' },
        { name: 'Figma', level: 90, color: '#7209b7' },
        { name: 'Prototyping', level: 85, color: '#f72585' },
        { name: 'User Research', level: 80, color: '#4cc9f0' },
        { name: 'Frontend Dev', level: 70, color: '#10b981' }
      ]
    });
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (updateProfile) {
        updateProfile(profileData);
      }
      
      setSaveMessage('Profile updated successfully!');
      setIsEditing(false);
      
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Error updating profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form data
    setProfileData({
      name: user?.name || 'John Doe',
      email: user?.email || 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      bio: 'Senior Product Designer with 8+ years of experience creating beautiful and functional user interfaces. Passionate about design systems and user experience.',
      location: 'San Francisco, CA',
      website: 'johndoe.design',
      company: 'TechCorp Inc.',
      jobTitle: 'Senior Product Designer',
      twitter: '@johndoe',
      linkedin: 'linkedin.com/in/johndoe',
      github: 'github.com/johndoe'
    });
    setIsEditing(false);
    setSaveMessage('');
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'activity', label: 'Activity', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' }
  ];

  const recentActivities = [
    { id: 1, type: 'project', action: 'created', title: 'Mobile App Redesign', time: '2 hours ago', icon: '💼' },
    { id: 2, type: 'task', action: 'completed', title: 'User Flow Documentation', time: '5 hours ago', icon: '✅' },
    { id: 3, type: 'team', action: 'added', title: 'Sarah Johnson to Design Team', time: '1 day ago', icon: '👥' },
    { id: 4, type: 'meeting', action: 'scheduled', title: 'Client Review - TechCorp', time: '2 days ago', icon: '📅' },
    { id: 5, type: 'achievement', action: 'earned', title: 'Top Performer of the Month', time: '1 week ago', icon: '🏆' }
  ];

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-hero">
          <div className="hero-background"></div>
          <div className="hero-content">
            <div className="profile-avatar-section">
              <div className="avatar-container">
                <div className="profile-avatar">
                  {getInitials(profileData.name)}
                </div>
                <div className="avatar-status online"></div>
              </div>
              <div className="profile-basic-info">
                <h1>{profileData.name}</h1>
                <p>{profileData.jobTitle} at {profileData.company}</p>
                <div className="profile-stats">
                  <div className="stat">
                    <span className="stat-number">{userStats.projectsCompleted}</span>
                    <span className="stat-label">Projects</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">{userStats.tasksCompleted}</span>
                    <span className="stat-label">Tasks</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">{userStats.teamMembers}</span>
                    <span className="stat-label">Team</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">{userStats.satisfactionRate}</span>
                    <span className="stat-label">Rating</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="profile-actions">
              {!isEditing ? (
                <>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    <i className="fas fa-edit"></i>
                    Edit Profile
                  </button>
                  <button className="btn btn-secondary">
                    <i className="fas fa-share"></i>
                    Share Profile
                  </button>
                  <button className="btn btn-ghost">
                    <i className="fas fa-download"></i>
                    Export CV
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="btn btn-success"
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                  >
                    <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-check'}`}></i>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={handleCancelEdit}
                    disabled={isLoading}
                  >
                    <i className="fas fa-times"></i>
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="profile-tabs">
        <div className="tabs-container">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        <div className="content-grid">
          {/* Left Column */}
          <div className="left-column">
            {/* Profile Information Card */}
            <div className="profile-card">
              <div className="card-header">
                <h3>Personal Information</h3>
                {!isEditing && (
                  <button 
                    className="edit-icon"
                    onClick={() => setIsEditing(true)}
                    title="Edit Profile"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                )}
              </div>
              
              {saveMessage && (
                <div className="save-message success">
                  <i className="fas fa-check-circle"></i>
                  {saveMessage}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="profile-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    ) : (
                      <div className="form-display">{profileData.name}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    ) : (
                      <div className="form-display">{profileData.email}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    ) : (
                      <div className="form-display">{profileData.phone}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="jobTitle">Job Title</label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="jobTitle"
                        name="jobTitle"
                        value={profileData.jobTitle}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    ) : (
                      <div className="form-display">{profileData.jobTitle}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="company">Company</label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={profileData.company}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    ) : (
                      <div className="form-display">{profileData.company}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={profileData.location}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    ) : (
                      <div className="form-display">{profileData.location}</div>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="bio">Bio</label>
                    {isEditing ? (
                      <textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        className="form-textarea"
                        rows="4"
                      />
                    ) : (
                      <div className="form-display bio">{profileData.bio}</div>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Skills Card */}
            <div className="profile-card">
              <div className="card-header">
                <h3>Skills & Expertise</h3>
                <button className="edit-icon" title="Edit Skills">
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              <div className="skills-list">
                {userStats.skills.map((skill, index) => (
                  <div key={index} className="skill-item">
                    <div className="skill-header">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percentage">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <div 
                        className="skill-progress"
                        style={{
                          width: `${skill.level}%`,
                          backgroundColor: skill.color
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Social Links Card */}
            <div className="profile-card">
              <div className="card-header">
                <h3>Social Links</h3>
                {isEditing && (
                  <button className="edit-icon" title="Edit Social Links">
                    <i className="fas fa-edit"></i>
                  </button>
                )}
              </div>
              <div className="social-links">
                <div className="social-link">
                  <div className="social-icon twitter">🐦</div>
                  <div className="social-info">
                    <span className="social-platform">Twitter</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.twitter}
                        onChange={(e) => setProfileData({...profileData, twitter: e.target.value})}
                        className="social-input"
                      />
                    ) : (
                      <span className="social-handle">{profileData.twitter}</span>
                    )}
                  </div>
                </div>
                
                <div className="social-link">
                  <div className="social-icon linkedin">💼</div>
                  <div className="social-info">
                    <span className="social-platform">LinkedIn</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.linkedin}
                        onChange={(e) => setProfileData({...profileData, linkedin: e.target.value})}
                        className="social-input"
                      />
                    ) : (
                      <span className="social-handle">{profileData.linkedin}</span>
                    )}
                  </div>
                </div>
                
                <div className="social-link">
                  <div className="social-icon github">💻</div>
                  <div className="social-info">
                    <span className="social-platform">GitHub</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.github}
                        onChange={(e) => setProfileData({...profileData, github: e.target.value})}
                        className="social-input"
                      />
                    ) : (
                      <span className="social-handle">{profileData.github}</span>
                    )}
                  </div>
                </div>
                
                <div className="social-link">
                  <div className="social-icon website">🌐</div>
                  <div className="social-info">
                    <span className="social-platform">Website</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.website}
                        onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                        className="social-input"
                      />
                    ) : (
                      <span className="social-handle">{profileData.website}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Card */}
            <div className="profile-card">
              <div className="card-header">
                <h3>Recent Activity</h3>
                <Link to="/activity" className="view-all">View All</Link>
              </div>
              <div className="activity-feed">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">{activity.icon}</div>
                    <div className="activity-content">
                      <p>
                        <strong>{activity.title}</strong> {activity.action}
                      </p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Activity Chart */}
            <div className="profile-card">
              <div className="card-header">
                <h3>Weekly Activity</h3>
                <span className="chart-period">This Week</span>
              </div>
              <div className="activity-chart">
                <div className="chart-bars">
                  {userStats.weeklyActivity.map((value, index) => (
                    <div key={index} className="chart-bar-container">
                      <div 
                        className="chart-bar"
                        style={{ height: `${value}%` }}
                      ></div>
                      <span className="chart-label">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

