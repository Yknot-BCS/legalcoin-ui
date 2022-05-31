<script lang="ts">
import { requiredRule } from './inputRules';
import auth from 'src/auth';
import { ref } from 'vue';
import { useStore } from 'src/store';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

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
        try {
          // Login
          await auth.login(userEmail, userPassword);
          // Refresh profile
          await store.dispatch('account/refreshProfile');
          $q.notify({
            type: 'positive',
            message: 'Logged in'
          });
          // Navigate to home
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
.page-wrapper
  .row.q-pa-md.bg-grey-3
    .text-h5.col-12 Login
    q-form.col-12.row.q-mb-sm.q-gutter-y-lg(@submit='onSubmit')
      q-input.col-12(
        v-model='userEmail',
        label='Email',
        lazy-rules,
        :rules='[requiredRule]',
        autocomplete='email'
      )
      q-input.col-12(
        v-model='userPassword',
        type='password',
        label='Password',
        lazy-rules,
        :rules='[requiredRule]',
        autocomplete='current-password'
      )
      q-btn.col-12(type='submit', color='primary') Login

    .col-12.text-center
      span.q-mr-xs Forgot your password?
      router-link(to='resetpassword') Reset Password
    .col-12.text-center
      span.q-mr-xs Need an account?
      router-link(to='register') Register
  .row.justify-center.align-center.q-my-lg
    router-link.skip-link(:to='{ name: "home" }') Skip this step
</template>

<style lang="sass" scoped>
.page-wrapper
  flex-basis: 600px
  flex-grow: 0
  flex-shrink: 1
.skip-link
  text-decoration: none
  font-style: italic
  color: black
</style>
