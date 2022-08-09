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
//- Desktop
q-card.row.col.animated.fadeInDown.justify-center.triangle(
  v-if='$q.screen.gt.sm'
)
  .col-4.self-center(style='z-index: 1')
    img.text-center.q-mr-xl.q-mb-xl(
      src='~assets/legalcoin-full.png',
      style='width: 18rem'
    )
  AuthCard.q-py-xl
    .text-body1.text-bold.text-grey-10.col-12.q-pt-md Sign In
    .text-body2.text-grey-10 to continue to LegalCoin
    q-form.text-body1.col-12.row.q-mb-sm.q-gutter-y-lg(@submit='onSubmit')
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
      q-btn.col-12(type='submit', color='primary', text-color='secondary') SIGN IN
      q-btn.col-12(
        flat,
        color='grey-10',
        @click='navigate("passwordresetrequest")'
      ) Forgot your password?
    .col-12.text-center
      span.q-mr-xs Need an account?
      router-link(to='register') Sign Up
    .q-mt-lg(style='border: 1px solid #ddd')
    .row.justify-center.align-center.q-mt-lg
      router-link.skip-link(:to='{ name: "home" }') Skip this step
//- Mobile
AuthCard.col-6.animated.fadeInDown.q-ma-sm(v-else)
  .row.justify-center
    img(src='~assets/legalcoin-full.png', style='width: 13rem')
  .text-body1.text-weight-bold.text-grey-10.col-12 Sign In
  q-form.text-body1.col-12.row.q-mb-sm.q-gutter-y-lg(@submit='onSubmit')
    q-input.col-12(
      v-model='userEmail',
      label='Email',
      lazy-rules,
      :rules='[requiredRule]',
      autocomplete='email',
      type='email'
    )
    q-input.col-12(
      v-model='userPassword',
      type='password',
      label='Password',
      lazy-rules,
      :rules='[requiredRule]',
      autocomplete='current-password'
    )
    q-btn.col-12(type='submit', color='primary', text-color='secondary') SIGN IN
    q-btn.col-12(
      flat,
      color='grey-10',
      @click='navigate("passwordresetrequest")'
    ) Forgot your password?
  .col-12.text-center
    span.q-mr-xs Need an account?
    router-link(to='register') Sign Up
  //- separator
  .q-mt-lg(style='border: 1px solid #ddd')
  .row.justify-center.align-center.q-mt-lg
    router-link.skip-link(:to='{ name: "home" }') Skip this step
</template>

<style lang="sass" scoped></style>
