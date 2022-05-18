<script lang="ts">
import { requiredRule } from './inputRules';
import { useLogin } from './useLogin';
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
        // Verify user
        // Open session
        // Get Telos account and other user data
        // Navigate to home
        store.commit('account/setLogin', true);
        await router.push({ name: 'home' });
      },
      onLogin: async () => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          await useLogin(store, userEmail.value, userPassword.value);
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
  q-form(@submit="onLogin").col-12.row.q-mb-sm.q-gutter-y-lg
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
