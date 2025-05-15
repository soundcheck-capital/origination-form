import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchApplications, logoutUser } from '../store/authSlice';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const { user, isAuthenticated, applications, loading } = auth;
  const [activeMenuItem, setActiveMenuItem] = useState('applications');

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchApplications());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return '#f0ad4e'; // orange
      case 'submitted': return '#0275d8'; // blue
      case 'approved': return '#5cb85c'; // green
      case 'rejected': return '#d9534f'; // red
      default: return '#6c757d'; // gray
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h3>SoundCheck</h3>
        </div>
        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-info">
            <div className="user-email">{user?.email || ''}</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className={activeMenuItem === 'applications' ? 'active' : ''}>
              <button onClick={() => setActiveMenuItem('applications')}>
                <span className="menu-icon">📄</span>
                Applications
              </button>
            </li>
            <li className={activeMenuItem === 'settings' ? 'active' : ''}>
              <button onClick={() => setActiveMenuItem('settings')}>
                <span className="menu-icon">⚙️</span>
                Settings
              </button>
            </li>
            <li>
              <button onClick={handleLogout}>
                <span className="menu-icon">🚪</span>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-content">
        {activeMenuItem === 'applications' && (
          <div className="applications-container">
            <div className="applications-header">
              <h1>My Applications</h1>
              <Link to="/new-application" className="btn btn-primary">
                + New Application
              </Link>
            </div>

            {loading ? (
              <div className="loading-indicator">Loading your applications...</div>
            ) : !applications || applications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📄</div>
                <h3>No applications yet</h3>
                <p>Create your first application to get started</p>
                <Link to="/new-application" className="btn btn-primary">
                  Create Application
                </Link>
              </div>
            ) : (
              <div className="applications-list">
                <div className="application-card application-header">
                  <div className="application-name">Name</div>
                  <div className="application-status">Status</div>
                  <div className="application-date">Last Updated</div>
                  <div className="application-actions">Actions</div>
                </div>
                {Array.isArray(applications) && applications.map((app) => (
                  <div key={app.id} className="application-card">
                    <div className="application-name">{app.name || `Application #${app.id}`}</div>
                    <div className="application-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(app.status) }}
                      >
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                    <div className="application-date">{formatDate(app.updatedAt)}</div>
                    <div className="application-actions">
                      <Link to={`/application/${app.id}`} className="btn btn-sm btn-outline">
                        {app.status === 'draft' ? 'Continue' : 'View'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeMenuItem === 'settings' && (
          <div className="settings-container">
            <h1>Account Settings</h1>
            <p>Account settings will be available soon.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard; 