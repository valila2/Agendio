export const getToken = () => localStorage.getItem('token');

export const getUserInfo = () => {
  const token = getToken();
  if (!token) return null;

  const payload = token.split('.')[1];
  const decoded = atob(payload);
  return JSON.parse(decoded);
};