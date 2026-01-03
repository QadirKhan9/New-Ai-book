/**
 * Signin page component
 */

import React from 'react';
import SigninForm from '../components/auth/SigninForm';

const SigninPage = () => {
  const handleSignin = (userData) => {
    console.log('Signin successful:', userData);
    // Redirect to dashboard or profile page
    window.location.href = '/dashboard';
  };

  return (
    <div className="signin-page">
      <div className="container">
        <h1>Welcome Back</h1>
        <p>Sign in to access your personalized experience</p>
        
        <SigninForm onSignin={handleSignin} />
        
        <div className="signup-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;