export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

export const logout = () => {
  localStorage.removeItem('token');
  // You might want to remove other user-related data as well
  window.location.href = '/login';
}; 