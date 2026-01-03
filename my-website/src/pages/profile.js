import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from '@site/src/css/auth-pages.module.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    software_level: '',
    programming_languages: [],
    hardware_knowledge: [],
    experience_level: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Fetch user profile on component mount
    const fetchProfile = async () => {
      try {
        // Import the auth utility function
        const { getAuthToken } = await import('../utils/authUtils');
        const token = getAuthToken();
        if (!token) {
          window.location.href = '/signin';
          return;
        }

        // Get user info from localStorage
        const user = localStorage.getItem('user');
        if (user) {
          const userData = JSON.parse(user);
          setUserEmail(userData.email || '');
        }

        // Define the API URL - you can change this to match your backend configuration
        // Using window object to allow runtime configuration
        const API_URL = window.API_URL || 'http://localhost:8000';

        const response = await fetch(`${API_URL}/api/v1/auth/profile/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired or invalid, redirect to signin
            import('../utils/authUtils').then(({ removeAuthToken }) => {
              removeAuthToken();
            });
            window.location.href = '/signin';
            return;
          } else if (response.status === 404) {
            setError('Profile endpoint not found. Please make sure the backend-auth server is running and the profile endpoint is available at http://localhost:8000/api/v1/auth/profile.');
            return;
          } else if (response.status >= 500) {
            setError('Server error. Please make sure the backend server is running properly.');
            return;
          }

          // Try to get the error message from the response
          let errorMessage = 'Failed to fetch profile';
          try {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorData.message || errorMessage;
          } catch (parseError) {
            // If we can't parse the error response, use the status text
            errorMessage = response.statusText || errorMessage;
          }

          throw new Error(errorMessage);
        }

        const data = await response.json();
        setProfile({
          software_level: data.software_level,
          programming_languages: data.programming_languages || [],
          hardware_knowledge: data.hardware_knowledge || [],
          experience_level: data.experience_level
        });
      } catch (err) {
        setError('Failed to load profile. Please try again.');
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      // Import the auth utility function
      const { getAuthToken } = await import('../utils/authUtils');
      const token = getAuthToken();
      if (!token) {
        window.location.href = '/signin';
        return;
      }

      const response = await fetch('http://localhost:8000/api/v1/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          software_level: profile.software_level,
          programming_languages: profile.programming_languages,
          hardware_knowledge: profile.hardware_knowledge,
          experience_level: profile.experience_level
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid, redirect to signin
          import('../utils/authUtils').then(({ removeAuthToken }) => {
            removeAuthToken();
          });
          window.location.href = '/signin';
          return;
        }
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      alert('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Profile update error:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setProfile(prev => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter(item => item !== value)
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePasswordChangeInput = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Validate password match
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    // Validate password length
    if (passwordData.newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }

    try {
      // Import the auth utility function
      const { getAuthToken } = await import('../utils/authUtils');
      const token = getAuthToken();
      if (!token) {
        window.location.href = '/signin';
        return;
      }

      const response = await fetch('http://localhost:8000/api/v1/auth/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Current password is incorrect');
          return;
        }
        throw new Error('Failed to change password');
      }

      const data = await response.json();
      alert('Password updated successfully!');

      // Reset password form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });

      // Hide the password change form
      setShowPasswordChange(false);
    } catch (err) {
      setError('Failed to change password. Please try again.');
      console.error('Password change error:', err);
    }
  };

  const handleLogout = () => {
    // Remove tokens from localStorage using the utility function
    import('../utils/authUtils').then(({ removeAuthToken }) => {
      removeAuthToken();
    });

    // Redirect to home page to update navbar state
    window.location.href = '/';
  };

  if (loading) {
    return (
      <Layout title="Loading Profile" description="Loading your profile information">
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <h1 className={styles.authTitle}>Loading Profile</h1>
            <p className={styles.authSubtitle}>Loading your profile information...</p>
            <div className="text--center">
              <div className="loading-spinner"></div>
              <p>Loading your profile...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Your Profile" description="Manage your profile information">
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <h1 className={styles.authTitle}>Your Profile</h1>
          <p className={styles.authSubtitle}>
            Update your software and hardware background information
          </p>

          {error && (
            <div className={`${styles.alert} ${styles.alertError}`} role="alert">
              {error}
            </div>
          )}

          {userEmail && (
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email:</label>
              <div className={styles.formControl} style={{ backgroundColor: 'var(--robotics-card-border)' }}>
                {userEmail}
              </div>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label htmlFor="software_level" className={styles.formLabel}>Software Level:</label>
              <select
                id="software_level"
                name="software_level"
                className={styles.formSelect}
                value={profile.software_level}
                onChange={handleChange}
                required
              >
                <option value="">Select your level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="programming_languages" className={styles.formLabel}>Programming Languages (comma separated):</label>
              <input
                type="text"
                id="programming_languages"
                name="programming_languages"
                className={styles.formControl}
                value={profile.programming_languages.join(', ')}
                onChange={(e) => {
                  const langs = e.target.value
                    .split(',')
                    .map(lang => lang.trim())
                    .filter(lang => lang);
                  setProfile(prev => ({ ...prev, programming_languages: langs }));
                }}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Hardware Knowledge:</label>
              <div className={styles.checkboxGroup}>
                {['IoT', 'Robotics', 'PC Hardware', 'None'].map((item) => (
                  <label key={item} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="hardware_knowledge"
                      value={item}
                      checked={profile.hardware_knowledge.includes(item)}
                      onChange={handleChange}
                      className="form-check-input"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="experience_level" className={styles.formLabel}>Experience Level:</label>
              <select
                id="experience_level"
                name="experience_level"
                className={styles.formSelect}
                value={profile.experience_level}
                onChange={handleChange}
                required
              >
                <option value="">Select your level</option>
                <option value="Student">Student</option>
                <option value="Professional">Professional</option>
                <option value="Hobbyist">Hobbyist</option>
              </select>
            </div>

            <button type="submit" className={styles.authButton}>
              Update Profile
            </button>
          </form>

          <div className={styles.formGroup}>
            <button
              type="button"
              className={styles.authButton}
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              style={{ marginTop: '1.5rem' }}
            >
              {showPasswordChange ? 'Cancel Password Change' : 'Change Password'}
            </button>
          </div>

          {showPasswordChange && (
            <form onSubmit={handlePasswordChange} className={styles.authForm}>
              <div className={styles.formGroup}>
                <label htmlFor="currentPassword" className={styles.formLabel}>Current Password:</label>
                <div className={styles.passwordContainer}>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    className={`${styles.formControl} ${styles.passwordInput}`}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChangeInput}
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                  >
                    {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="newPassword" className={styles.formLabel}>New Password:</label>
                <div className={styles.passwordContainer}>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    className={`${styles.formControl} ${styles.passwordInput}`}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChangeInput}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmNewPassword" className={styles.formLabel}>Confirm New Password:</label>
                <div className={styles.passwordContainer}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    className={`${styles.formControl} ${styles.passwordInput}`}
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChangeInput}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <button type="submit" className={styles.authButton}>
                Update Password
              </button>
            </form>
          )}

          <div className={styles.authLink}>
            <button
              type="button"
              className={styles.authButton}
              onClick={handleLogout}
              style={{ marginRight: '1rem' }}
            >
              Logout
            </button>
            <Link to="/dashboard">Back to Dashboard</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;