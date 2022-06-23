/* eslint-disable @typescript-eslint/no-unsafe-call */
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
      signIn(
        input: {
          email: "${userEmail.value}"
          password: "${userPassword.value}"
        }
      ) {
        token
        sessionLength
      }
    }
  `)) as any;

  setAccessToken(res.signIn.token);
  setSessionExpiry(res.signIn.sessionLength);
  await emailVerificationRequest();
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
        accountName
        publicKey
        secret
        linkedAccounts
      }
    }`)) as any;
  const profile = res.profile;
  if (profile.accountName === null) profile.accountName = '';
  return profile;
}

export async function passwordResetRequest(userEmail: Ref<string>) {
  await api.accounts.mutation(`
    {
      passwordResetRequest(
        input: {
          email: "${userEmail.value}"
        }
      )
    }
  `);
}

export async function passwordResetNew(
  resetToken: string,
  newPassword: string
) {
  await api.accounts.mutation(`
  {
    passwordResetNew(
      input:{
        resetToken: "${resetToken}"
        newPassword: "${newPassword}"
      }
    )
  }
  `);
}

export async function passwordNew(
  currentPassword: string,
  newPassword: string
) {
  await api.accounts.mutation(`
  {
    passwordNew(
      input:{
        currentPassword: "${currentPassword}"
        newPassword: "${newPassword}"
      }
    )
  }
  `);
}

export async function emailVerificationRequest() {
  await api.accounts.mutation(`
    mutation {
      emailVerifyRequest
    }
  `);
}

export async function cryptoNew(password: string) {
  await api.accounts.mutation(`
    {
      cryptoNew(
        input:{
          password: "${password}"
      })
    }
  `);
}
