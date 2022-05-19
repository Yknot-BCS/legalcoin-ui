export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export const setAccessToken = (token: string) => {
  localStorage.setItem('accessToken', token);
};

export const getSessionExpiry = () => {
  const expiry = localStorage.getItem('sessionExpiry');
  if (!isNaN(Number(expiry))) return Number(expiry);
  else return 0;
};

export const setSessionExpiry = (sessionLength: number) => {
  const expiry = new Date().valueOf() + sessionLength;
  localStorage.setItem('sessionExpiry', expiry.toString());
};

export const sessionExpired = () => {
  return Date.now() > getSessionExpiry();
};

export const isAuthenticated = () => {
  return getAccessToken() != '' && !sessionExpired();
};
