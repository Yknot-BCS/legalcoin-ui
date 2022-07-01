<script lang="ts">
import auth from 'src/auth';
import AuthCard from '../../components/auth/AuthCard.vue';

import { ref } from 'vue';
import { defineComponent } from 'vue';
import { requiredRule } from './inputRules';
import { passRule } from './inputRules';
import { passLenRule } from './inputRules';
import { emailValidRule } from './inputRules';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

export default defineComponent({
  components: {
    AuthCard
  },
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const userName = ref('');
    const userSurname = ref('');
    const userEmail = ref('');
    const userPassword = ref('');
    function passwordMatchRule(val: string): string | boolean {
      return val === userPassword.value || 'Passwords do not match';
    }
    return {
      userName,
      userSurname,
      userEmail,
      userPassword,
      userRetypePassword: ref(''),
      requiredRule,
      passRule,
      passLenRule,
      emailValidRule,
      passwordMatchRule,
      onSubmit: async () => {
        try {
          await auth.register(userName, userSurname, userEmail, userPassword);
          $q.notify({
            type: 'positive',
            message: 'Registered'
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
});
</script>

<template lang="pug">
AuthCard
  .text-h5.col-12.text-weight-bold Sign Up
  p.col-12 for a brand new LegalCoin account
  q-form.col-12.row.q-mb-sm.q-gutter-y-lg(@submit='onSubmit')
    q-input.col-6.q-pr-md(
      v-model='userName',
      label='Name',
      lazy-rules,
      :rules='[requiredRule]',
      autocomplete='given-name'
    )
    q-input.col-6(
      v-model='userSurname',
      label='Surname',
      lazy-rules,
      :rules='[requiredRule]',
      autocomplete='family-name'
    )
    q-input.col-12(
      v-model='userEmail',
      label='Email',
      lazy-rules,
      :rules='[requiredRule, emailValidRule]',
      type='email',
      autocomplete='email'
    )
    q-input.col-12(
      v-model='userPassword',
      type='password',
      label='Password',
      lazy-rules,
      :rules='[requiredRule, passRule, passLenRule]',
      autocomplete='new-password'
    )
    q-input.col-12(
      v-model='userRetypePassword',
      type='password',
      label='Retype Password',
      lazy-rules,
      :rules='[requiredRule, passwordMatchRule]',
      autocomplete='new-password'
    )
    q-btn.col-12(type='submit', color='primary') Create an account
  .col-12.text-center.q-mt-md
    span.q-mr-xs Already have an account?
    router-link(to='login') Sign In
</template>

<style lang="sass" scoped></style>
