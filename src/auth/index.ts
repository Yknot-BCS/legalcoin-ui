import { login, register, getProfile } from './user';
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
  isLoggedIn
};
