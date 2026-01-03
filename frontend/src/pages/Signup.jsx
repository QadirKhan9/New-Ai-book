/**
 * Signup page component
 */

import React from 'react';
import SignupForm from '../components/auth/SignupForm';

const SignupPage = () => {
  const handleSignup = (userData) => {
    console.log('Signup successful:', userData);
    // Redirect to dashboard or profile page
    window.location.href = '/dashboard';
  };

  return (
    <div className="signup-page">
      <div className="container">
        <h1>Create Your Account</h1>
        <p>Sign up to personalize your experience</p>
        
        <SignupForm onSignup={handleSignup} />
        
        <div className="login-link">
          Already have an account? <a href="/signin">Sign in</a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;