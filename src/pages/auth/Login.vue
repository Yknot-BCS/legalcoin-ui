<script lang="ts">
import auth from 'src/auth';
import AuthCard from '../../components/auth/AuthCard.vue';

import { ref, computed } from 'vue';
import { defineComponent } from 'vue';
import { requiredRule } from './inputRules';
import { useStore } from 'src/store';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

export default defineComponent({
  components: {
    AuthCard
  },
  setup() {
    const userEmail = ref('');
    const userPassword = ref('');
    const store = useStore();
    const router = useRouter();
    const profile = computed(() => store.state.account.profile);
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

          // Create new crypto account
          if (
            (profile.value.accountName === '' || !profile.value.accountName) &&
            profile.value.emailVerified
          ) {
            try {
              await auth.cryptoNew(userPassword.value);
            } catch (error) {
              $q.notify({
                type: 'negative',
                message: (error as Error).message
              });
            }
          }

          // Navigate to home
          await router.push({ name: 'home' });
        } catch (error) {
          $q.notify({
            type: 'negative',
            message: (error as Error).message
          });
        }
      },
      navigate: async (name: string) => {
        await router.push({ name: name });
      }
    };
  }
});
</script>

<template lang="pug">
AuthCard
  .text-h5.col-12.text-weight-bold Sign In
  p.col-12 to continue to LegalCoin
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
    q-btn.col-12(type='submit', color='primary') Sign In
    q-btn.col-12(
      flat,
      color='primary',
      @click='navigate("passwordresetrequest")'
    ) Forgot your password?
  .col-12.text-center
    span.q-mr-xs Need an account?
    router-link(to='register') Sign Up
  // TODO: Fix quasar seperator
  .q-mt-lg(style='border: 1px solid #ddd')
  .row.justify-center.align-center.q-mt-lg
    router-link.skip-link(:to='{ name: "home" }') Skip this step
</template>

<style lang="sass" scoped></style>
