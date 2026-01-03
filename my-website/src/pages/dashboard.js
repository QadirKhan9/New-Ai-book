import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    import('../utils/authUtils').then(({ getAuthToken }) => {
      const token = getAuthToken();
      if (!token) {
        // Redirect to signin if not authenticated
        window.location.href = '/signin';
        return;
      }

      // In a real implementation, we would decode the JWT to get user info
      // For now, we'll just set a flag indicating the user is logged in
      try {
        setUser({ email: 'user@example.com' }); // Placeholder - in real app, decode token to get user info
      } catch (error) {
        console.error('Error decoding token:', error);
        // If token is invalid, redirect to signin
        import('../utils/authUtils').then(({ removeAuthToken }) => {
          removeAuthToken();
        });
        window.location.href = '/signin';
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const handleSignOut = () => {
    // Remove tokens from localStorage using the utility function
    import('../utils/authUtils').then(({ removeAuthToken }) => {
      removeAuthToken();
    });

    // Redirect to signin page to update navbar state
    window.location.href = '/signin';
  };

  if (loading) {
    return (
      <Layout title="Loading Dashboard" description="Loading your personalized dashboard">
        <div className="container margin-vert--lg">
          <div className="row">
            <div className="col col--6 col--offset-3">
              <div className="text--center">
                <div className="loading-spinner"></div>
                <p>Loading your dashboard...</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard" description="Your personalized dashboard">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <header className="margin-bottom--lg">
              <h1>Welcome to Your Dashboard</h1>
              <div className="text--right">
                <button 
                  onClick={handleSignOut}
                  className="button button--secondary button--sm"
                >
                  Sign Out
                </button>
              </div>
            </header>
            
            <div className="dashboard-content">
              <section className="margin-bottom--lg">
                <h2>About Your Profile</h2>
                <p>
                  Based on your profile, we can provide personalized content recommendations.
                  You can update your profile information anytime to improve your experience.
                </p>
                <Link to="/profile" className="button button--primary">
                  Update Profile
                </Link>
              </section>
              
              <section className="margin-bottom--lg">
                <h2>Book Recommendations</h2>
                <p>
                  Based on your interests and background, here are some chapters you might find interesting:
                </p>
                <ul>
                  <li><Link to="/docs/chapter-3-authentication">Chapter 3: Authentication Systems</Link></li>
                  <li><Link to="/docs/chapter-7-security">Chapter 7: Security Best Practices</Link></li>
                  <li><Link to="/docs/chapter-9-database">Chapter 9: Database Design Principles</Link></li>
                </ul>
              </section>
              
              <section>
                <h2>Continue Reading</h2>
                <p>
                  <Link to="/docs/intro">Introduction to Physical AI</Link> - Last read: 2 hours ago
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;