// Configuration for the translation API
// Use the environment variable if available, otherwise use default
const config = {
  // Default API URL - can be overridden by environment variables in production
  apiUrl: typeof window !== 'undefined'
    ? (window as any)._env_?.REACT_APP_API_URL || 'http://localhost:8000/api/v1'
    : 'http://localhost:8000/api/v1',
};

export default config;