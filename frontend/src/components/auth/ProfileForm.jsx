/**
 * Profile form component
 */

import React, { useState, useEffect } from 'react';
import profileService from '../services/profileService';

const ProfileForm = () => {
  const [profile, setProfile] = useState({
    software_level: 'Beginner',
    programming_languages: [],
    hardware_knowledge: [],
    experience_level: 'Student'
  });
  const [newLanguage, setNewLanguage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const result = await profileService.getProfile();
    if (result.success) {
      setProfile(result.data);
    } else {
      setError(result.error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim() && !profile.programming_languages.includes(newLanguage.trim())) {
      setProfile(prev => ({
        ...prev,
        programming_languages: [...prev.programming_languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (language) => {
    setProfile(prev => ({
      ...prev,
      programming_languages: prev.programming_languages.filter(lang => lang !== language)
    }));
  };

  const handleAddHardware = (hw) => {
    if (!profile.hardware_knowledge.includes(hw)) {
      setProfile(prev => ({
        ...prev,
        hardware_knowledge: [...prev.hardware_knowledge, hw]
      }));
    }
  };

  const handleRemoveHardware = (hw) => {
    setProfile(prev => ({
      ...prev,
      hardware_knowledge: prev.hardware_knowledge.filter(k => k !== hw)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validate profile data
    const validation = profileService.validateProfileData(profile);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      setLoading(false);
      return;
    }

    const result = await profileService.updateProfile(profile);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="profile-form">
      <h2>Your Profile</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Profile updated successfully!</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="software_level">Software Level:</label>
          <select
            id="software_level"
            name="software_level"
            value={profile.software_level}
            onChange={handleChange}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Programming Languages:</label>
          <div className="language-input">
            <input
              type="text"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="Add a programming language"
            />
            <button type="button" onClick={handleAddLanguage}>Add</button>
          </div>
          <div className="language-list">
            {profile.programming_languages.map((lang, index) => (
              <span key={index} className="language-tag">
                {lang}
                <button type="button" onClick={() => handleRemoveLanguage(lang)}>×</button>
              </span>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label>Hardware Knowledge:</label>
          <div className="hardware-options">
            {['IoT', 'Robotics', 'PC Hardware', 'None'].map(hw => (
              <label key={hw} className="checkbox-option">
                <input
                  type="checkbox"
                  checked={profile.hardware_knowledge.includes(hw)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleAddHardware(hw);
                    } else {
                      handleRemoveHardware(hw);
                    }
                  }}
                />
                {hw}
              </label>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="experience_level">Experience Level:</label>
          <select
            id="experience_level"
            name="experience_level"
            value={profile.experience_level}
            onChange={handleChange}
          >
            <option value="Student">Student</option>
            <option value="Professional">Professional</option>
            <option value="Hobbyist">Hobbyist</option>
          </select>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;