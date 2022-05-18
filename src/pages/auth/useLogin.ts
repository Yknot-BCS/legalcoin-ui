/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { api } from 'src/api';
import { auth } from 'src/auth';
import { Store } from 'vuex';

export async function useLogin(
  store: Store<any>,
  userEmail: string,
  userPassword: string
) {
  // Sign in
  let res;
  res = (await api.accounts.mutation(`
      {
        signIn(input: {
          email: "${userEmail}",
          password: "${userPassword}"
        }) {
          token
          sessionLength
        }
      }
    `)) as any;

  // Set session in local storage
  auth.setAccessToken(res.signIn.token);
  auth.setSessionExpiry(res.signIn.sessionLength);

  // Get profile
  res = (await api.accounts.query(`
    {
      profile{
        name
        surname
        email
        emailVerified
        receiveEmailNotifications
      }
    }`)) as any;
  store.commit('account/setUserProfile', res.profile);

  // TODO get Telos account
}
