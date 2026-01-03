/**
 * Dashboard page component
 */

import React from 'react';
import authService from '../services/authService';

const DashboardPage = () => {
  const handleSignout = async () => {
    await authService.signout();
    window.location.href = '/signin';
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <header>
          <h1>Dashboard</h1>
          <button onClick={handleSignout}>Sign Out</button>
        </header>
        
        <div className="dashboard-content">
          <nav>
            <ul>
              <li><a href="/profile">Your Profile</a></li>
              <li><a href="/settings">Settings</a></li>
            </ul>
          </nav>
          
          <main>
            <h2>Welcome to Your Personalized Dashboard</h2>
            <p>Based on your profile, here's content tailored to your interests:</p>
            
            <div className="personalized-content">
              <section>
                <h3>Recommended Resources</h3>
                <ul>
                  <li>Resource 1 based on your profile</li>
                  <li>Resource 2 based on your profile</li>
                  <li>Resource 3 based on your profile</li>
                </ul>
              </section>
              
              <section>
                <h3>Recent Activity</h3>
                <p>Your recent activity would appear here</p>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;