const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

const setAccessToken = (token: string) => {
  localStorage.setItem('accessToken', token);
};

const getSessionExpiry = () => {
  const expiry = localStorage.getItem('sessionExpiry');
  if (!isNaN(Number(expiry))) return Number(expiry);
  else return 0;
};

const setSessionExpiry = (sessionLength: number) => {
  const expiry = new Date().valueOf() + sessionLength;
  localStorage.setItem('sessionExpiry', expiry.toString());
};

const sessionExpired = () => {
  return Date.now() > getSessionExpiry();
};

const isAuthenticated = () => {
  return getAccessToken() != '' && !sessionExpired();
};

export const auth = {
  setAccessToken,
  getAccessToken,
  getSessionExpiry,
  setSessionExpiry,
  isAuthenticated
};
