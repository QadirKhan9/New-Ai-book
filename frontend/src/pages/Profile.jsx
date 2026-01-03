/**
 * Profile page component
 */

import React from 'react';
import ProfileForm from '../components/auth/ProfileForm';

const ProfilePage = () => {
  return (
    <div className="profile-page">
      <div className="container">
        <h1>Your Profile</h1>
        <p>Update your software and hardware background information</p>
        
        <ProfileForm />
      </div>
    </div>
  );
};

export default ProfilePage;