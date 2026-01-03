/**
 * Profile service for managing user profile data
 */

import authService from './authService';

class ProfileService {
  async getProfile() {
    return authService.getProfile();
  }

  async updateProfile(profileData) {
    return authService.updateProfile(profileData);
  }

  // Additional profile-related utility functions can be added here
  validateProfileData(profileData) {
    const errors = [];

    // Validate software level
    const validSoftwareLevels = ['Beginner', 'Intermediate', 'Advanced'];
    if (profileData.software_level && !validSoftwareLevels.includes(profileData.software_level)) {
      errors.push('Software level must be Beginner, Intermediate, or Advanced');
    }

    // Validate experience level
    const validExperienceLevels = ['Student', 'Professional', 'Hobbyist'];
    if (profileData.experience_level && !validExperienceLevels.includes(profileData.experience_level)) {
      errors.push('Experience level must be Student, Professional, or Hobbyist');
    }

    // Validate hardware knowledge
    const validHardwareKnowledge = ['IoT', 'Robotics', 'PC Hardware', 'None'];
    if (profileData.hardware_knowledge) {
      for (const hw of profileData.hardware_knowledge) {
        if (!validHardwareKnowledge.includes(hw)) {
          errors.push(`Hardware knowledge must be one of: ${validHardwareKnowledge.join(', ')}`);
          break;
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default new ProfileService();