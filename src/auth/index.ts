import { login, register } from './authentication';
import {
  setAccessToken,
  getAccessToken,
  getSessionExpiry,
  setSessionExpiry,
  isAuthenticated
} from './sessions';

export default {
  login,
  register,
  setAccessToken,
  getAccessToken,
  getSessionExpiry,
  setSessionExpiry,
  isAuthenticated
};
