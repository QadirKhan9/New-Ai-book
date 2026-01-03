import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from '@site/src/css/auth-pages.module.css';

const SigninPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Define the API URL - you can change this to match your backend configuration
      // Using window object to allow runtime configuration
      const API_URL = window.API_URL || 'http://localhost:8000';

      // Call the backend-auth API to authenticate the user
      const response = await fetch(`${API_URL}/api/v1/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      if (!response.ok) {
        // Try to get the error message from the response
        let errorMessage = 'Signin request failed';
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

      // Store the token and user info in localStorage using the utility function
      import('../utils/authUtils').then(({ setAuthToken }) => {
        setAuthToken(data.access_token, {
          id: data.user_id,
          email: data.email
        });
      });

      // Redirect to home page
      window.location.href = '/';
    } catch (err) {
      console.error('Signin error:', err);
      // Provide more specific error messages
      if (err.message.includes('401') || err.message.toLowerCase().includes('invalid') || err.message.toLowerCase().includes('credentials')) {
        setError('Invalid email or password. Please try again.');
      } else if (err.message.includes('400')) {
        setError(`Invalid input: ${err.message}`);
      } else if (err.message.includes('500')) {
        setError('Server error. Please try again later.');
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Unable to connect to the server. Please make sure the backend-auth server is running at http://localhost:8000.');
      } else if (err.message.includes('404') || err.message.includes('Not Found')) {
        setError('Signin endpoint not found. Please make sure the backend-auth server is running and the signin endpoint is available at http://localhost:8000/api/v1/auth/signin.');
      } else {
        setError(`Failed to sign in: ${err.message || 'Please try again.'}`);
      }
    }
  };

  return (
    <Layout title="Sign In" description="Log in to your account to access personalized features">
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <h1 className={styles.authTitle}>Sign In to Your Account</h1>
            <p className={styles.authSubtitle}>
              Access your personalized book experience
            </p>

            {error && (
              <div className={`${styles.alert} ${styles.alertError}`} role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.authForm}>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.formLabel}>Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={styles.formControl}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.formLabel}>Password:</label>
                <div className={styles.passwordContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className={`${styles.formControl} ${styles.passwordInput}`}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? '👁️' : '⌣'}
                  </button>
                </div>
              </div>

              <button type="submit" className={styles.authButton}>
                Sign In
              </button>
            </form>

            <div className={styles.authLink}>
              <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SigninPage;