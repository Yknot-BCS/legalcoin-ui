<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { api } from 'src/api';
import { useQuasar } from 'quasar';
import { useStore } from 'src/store';

export default {
  setup() {
    const $q = useQuasar();
    const store = useStore();
    return {
      login: async () => {
        try {
          // Sign in
          let res;
          res = (await api.accounts.mutation(`
          {
            signIn(input: {
              email: "jpbeukes01@gmail.com",
              password: "smile123"
            }) {
              token
              sessionLength
            }
          }
        `)) as any;

          // Set access token in local storage
          api.accounts.setAccessToken(res.signIn.token);

          // Set session in state
          store.commit('account/setLogin', res.signIn);

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

          $q.notify({
            type: 'positive',
            message: 'Logged in'
          });
        } catch (error) {
          $q.notify({
            type: 'negative',
            message: (error as Error).message
          });
        }
      }
    };
  }
};
</script>

<template lang="pug">
q-page
  h1 Home
  q-btn(@click="login") Click
</template>
