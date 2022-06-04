import {
  login,
  register,
  getProfile,
  passwordResetRequest,
  passwordResetNew
} from './user';
import {
  setAccessToken,
  getAccessToken,
  getSessionExpiry,
  setSessionExpiry,
  isLoggedIn
} from './sessions';

export default {
  login,
  register,
  getProfile,
  setAccessToken,
  getAccessToken,
  getSessionExpiry,
  setSessionExpiry,
  isLoggedIn,
  passwordResetRequest,
  passwordResetNew
};
