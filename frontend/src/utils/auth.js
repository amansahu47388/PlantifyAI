export const isAuthenticated = () => {
  return localStorage.getItem('access_token') !== null;
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
};