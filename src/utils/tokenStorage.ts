// src/auth/utils/tokenStorage.js
export const TOKEN_KEY = 'auth_token';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isTokenValid = () => {
  const token = getToken();
  if (!token) return false;
  
  // Basic check - in production you would verify expiration from decoded JWT
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } catch (e) {
    console.log(e)
    return false;
  }
};