/**
 * Signup form component
 */

import React, { useState } from 'react';
import authService from '../services/authService';

const SignupForm = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    software_level: 'Beginner',
    programming_languages: [],
    hardware_knowledge: [],
    experience_level: 'Student'
  });
  const [newLanguage, setNewLanguage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim() && !formData.programming_languages.includes(newLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        programming_languages: [...prev.programming_languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (language) => {
    setFormData(prev => ({
      ...prev,
      programming_languages: prev.programming_languages.filter(lang => lang !== language)
    }));
  };

  const handleAddHardware = (hw) => {
    if (!formData.hardware_knowledge.includes(hw)) {
      setFormData(prev => ({
        ...prev,
        hardware_knowledge: [...prev.hardware_knowledge, hw]
      }));
    }
  };

  const handleRemoveHardware = (hw) => {
    setFormData(prev => ({
      ...prev,
      hardware_knowledge: prev.hardware_knowledge.filter(k => k !== hw)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await authService.signup(formData);
    
    if (result.success) {
      onSignup && onSignup(result.data);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="signup-form">
      <h2>Sign Up</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <small>Password must be at least 8 characters with uppercase, lowercase, number, and special character</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="software_level">Software Level:</label>
          <select
            id="software_level"
            name="software_level"
            value={formData.software_level}
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
            {formData.programming_languages.map((lang, index) => (
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
                  checked={formData.hardware_knowledge.includes(hw)}
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
            value={formData.experience_level}
            onChange={handleChange}
          >
            <option value="Student">Student</option>
            <option value="Professional">Professional</option>
            <option value="Hobbyist">Hobbyist</option>
          </select>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;