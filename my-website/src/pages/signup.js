import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from '@site/src/css/auth-pages.module.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    software_level: 'Beginner',
    programming_languages: '',
    hardware_knowledge: [],
    experience_level: 'Student'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      // Handle hardware knowledge checkboxes
      setFormData(prev => ({
        ...prev,
        hardware_knowledge: checked
          ? [...prev.hardware_knowledge, value]
          : prev.hardware_knowledge.filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password length (bcrypt has a 72-byte limit)
    if (formData.password.length > 72) {
      setError('Password must be 72 characters or less.');
      return;
    }

    // Convert programming languages to array
    const programmingLangs = formData.programming_languages
      .split(',')
      .map(lang => lang.trim())
      .filter(lang => lang);

    try {
      // Define the API URL - you can change this to match your backend configuration
      // Using window object to allow runtime configuration
      const API_URL = window.API_URL || 'http://localhost:8000';

      // Call the backend-auth API to register the user
      const response = await fetch(`${API_URL}/api/v1/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          software_level: formData.software_level,
          programming_languages: programmingLangs,
          hardware_knowledge: formData.hardware_knowledge,
          experience_level: formData.experience_level
        }),
      });

      if (!response.ok) {
        // Try to get the error message from the response
        let errorMessage = 'Signup request failed';
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
        setAuthToken(data.access_token, data.user);
      });

      setSuccess(true);
      setError('');

      // Update auth state and redirect to home page after a delay
      setTimeout(() => {
        // Force a page refresh to update the navbar state
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      console.error('Signup error:', err);
      // Provide more specific error messages
      if (err.message.includes('E11000') || err.message.toLowerCase().includes('duplicate') || err.message.toLowerCase().includes('email') || err.message.toLowerCase().includes('exists')) {
        setError('An account with this email already exists. Please try signing in instead.');
      } else if (err.message.includes('password')) {
        setError(`Password error: ${err.message}`);
      } else if (err.message.includes('email')) {
        setError(`Email error: ${err.message}`);
      } else if (err.message.includes('400')) {
        setError(`Invalid input: ${err.message}`);
      } else if (err.message.includes('409')) {
        setError('An account with this email already exists. Please try signing in instead.');
      } else if (err.message.includes('500')) {
        setError('Server error. Please try again later.');
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Unable to connect to the server. Please make sure the backend-auth server is running at http://localhost:8000.');
      } else if (err.message.includes('404') || err.message.includes('Not Found')) {
        setError('Signup endpoint not found. Please make sure the backend-auth server is running and the signup endpoint is available at http://localhost:8000/api/v1/auth/signup.');
      } else {
        setError(`Failed to sign up: ${err.message || 'Please try again.'}`);
      }
    }
  };

  return (
    <Layout title="Sign Up" description="Create an account to enhance your book reading experience">
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <h1 className={styles.authTitle}>Create Your Account</h1>
            <p className={styles.authSubtitle}>
              Sign up to personalize your experience and save your progress
            </p>

            {success && (
              <div className={`${styles.alert} ${styles.alertSuccess}`} role="alert">
                Account created successfully! Redirecting to home page...
              </div>
            )}

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
                    minLength={8}
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
                <small className={styles.passwordRequirements}>Password must be at least 8 characters with uppercase, lowercase, number, and special character</small>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="software_level" className={styles.formLabel}>Software Level:</label>
                <select
                  id="software_level"
                  name="software_level"
                  className={styles.formSelect}
                  value={formData.software_level}
                  onChange={handleChange}
                >
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
                  value={formData.programming_languages}
                  onChange={handleChange}
                  placeholder="JavaScript, Python, etc."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Hardware Knowledge (select all that apply):</label>
                <div className={styles.checkboxGroup}>
                  {[
                    { value: 'IoT', label: 'IoT' },
                    { value: 'Robotics', label: 'Robotics' },
                    { value: 'PC Hardware', label: 'PC Hardware' },
                    { value: 'None', label: 'None' }
                  ].map((item) => (
                    <label key={item.value} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="hardware_knowledge"
                        value={item.value}
                        checked={formData.hardware_knowledge.includes(item.value)}
                        onChange={handleChange}
                        className="form-check-input"
                      />
                      {item.label}
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
                  value={formData.experience_level}
                  onChange={handleChange}
                >
                  <option value="Student">Student</option>
                  <option value="Professional">Professional</option>
                  <option value="Hobbyist">Hobbyist</option>
                </select>
              </div>

              <button type="submit" className={styles.authButton}>
                Create Account
              </button>
            </form>

            <div className={styles.authLink}>
              <p>Already have an account? <Link to="/signin">Sign in here</Link></p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignupPage;