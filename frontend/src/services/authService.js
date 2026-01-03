/**
 * Authentication service for handling user signup and signin
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  async signup(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        this.token = result.access_token;
        localStorage.setItem('token', result.access_token);
        return { success: true, data: result };
      } else {
        return { success: false, error: result.detail || 'Signup failed' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async signin(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (response.ok) {
        this.token = result.access_token;
        localStorage.setItem('token', result.access_token);
        return { success: true, data: result };
      } else {
        return { success: false, error: result.detail || 'Signin failed' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async signout() {
    this.token = null;
    localStorage.removeItem('token');
  }

  isAuthenticated() {
    return !!this.token;
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  async getProfile() {
    try {
      const token = this.getToken();
      if (!token) {
        return { success: false, error: 'No authentication token' };
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        return { success: true, data: result };
      } else {
        return { success: false, error: result.detail || 'Failed to get profile' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateProfile(profileData) {
    try {
      const token = this.getToken();
      if (!token) {
        return { success: false, error: 'No authentication token' };
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();

      if (response.ok) {
        return { success: true, data: result };
      } else {
        return { success: false, error: result.detail || 'Failed to update profile' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new AuthService();