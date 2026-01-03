// authUtils.ts
export const setAuthToken = (token: string, user: any) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  // Dispatch a custom event to notify other parts of the app about the auth change
  window.dispatchEvent(new Event('authChange'));
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Dispatch a custom event to notify other parts of the app about the auth change
  window.dispatchEvent(new Event('authChange'));
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

export const getTokenExpirationTime = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp;
  } catch (error) {
    console.error('Error getting token expiration time:', error);
    return null;
  }
};