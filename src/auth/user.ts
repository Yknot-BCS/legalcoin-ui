/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { api } from 'src/api';
import { setAccessToken, setSessionExpiry } from './sessions';
import { Ref } from 'vue';

export async function login(userEmail: Ref<string>, userPassword: Ref<string>) {
  // Sign in
  const res = (await api.accounts.mutation(`
      {
        signIn(input: {
          email: "${userEmail.value}",
          password: "${userPassword.value}"
        }) {
          token
          sessionLength
        }
      }
    `)) as any;

  // Set session in local storage
  setAccessToken(res.signIn.token);
  setSessionExpiry(res.signIn.sessionLength);

  // TODO get Telos account
}

export async function register(
  userName: Ref<string>,
  userSurname: Ref<string>,
  userEmail: Ref<string>,
  userPassword: Ref<string>
) {
  // Sign Up
  const res = (await api.accounts.mutation(`
      {
        signUp(input: {
          email: "${userEmail.value}",
          password: "${userPassword.value}"
          name: "${userName.value}"
          surname: "${userSurname.value}"
          receiveEmailNotifications: false
        }) 
      }
    `)) as any;

  // Send Email Verification

  // Sing In
  console.log(res);
}

export async function getProfile() {
  const res = (await api.accounts.query(`
    {
      profile{
        name
        surname
        email
        emailVerified
        receiveEmailNotifications
        cryptoAccount{
          accountName
          publicKey
          secret
          linkedAccounts
        }
      }
    }`)) as any;
  return res.profile;
}
