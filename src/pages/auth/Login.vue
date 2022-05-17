<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ref } from 'vue';
import { requiredRule } from './inputRules';
import { useStore } from 'src/store';
import { useRouter } from 'vue-router';
import { api } from 'src/api';
import { useQuasar } from 'quasar';
import { auth } from 'src/auth';

export default {
  setup() {
    const userEmail = ref('');
    const userPassword = ref('');
    const store = useStore();
    const router = useRouter();
    const $q = useQuasar();
    return {
      userEmail,
      userPassword,
      requiredRule,
      onSubmit: async () => {
        // Verify user
        // Open session
        // Get Telos account and other user data
        // Navigate to home
        store.commit('account/setLogin', true);
        await router.push({ name: 'home' });
      },
      login: async () => {
        try {
          // Sign in
          let res;
          res = (await api.accounts.mutation(`
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

          // Set access token in local storage
          auth.setAccessToken(res.signIn.token);
          auth.setSessionExpiry(res.signIn.sessionLength);

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
          await router.push({ name: 'home' });
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
.form-wrapper.row.q-pa-md.bg-grey-3
  .text-h5.col-12 Login
  q-form(@submit="login").col-12.row.q-mb-sm.q-gutter-y-lg
    q-input(
        v-model="userEmail"
        label="Email"
        lazy-rules
        :rules="[ requiredRule ]"
        autocomplete="email"
    ).col-12
    q-input(
        v-model="userPassword"
        type="password"
        label="Password"
        lazy-rules
        :rules="[ requiredRule ]"
        autocomplete="current-password"
    ).col-12
    q-btn(type="submit" color="primary").col-12 Login
  .col-12.text-center
    span.q-mr-xs Need an account?
    router-link(to="register") Register
  .col-12.text-center
    span.q-mr-xs Forgot your password?
    router-link(to="resetpassword") Reset Password

</template>

<style lang="sass" scoped>
.form-wrapper
  flex-basis: 600px
  flex-grow: 0
  flex-shrink: 1
</style>
