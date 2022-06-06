<script lang="ts">
import auth from 'src/auth';
import { ref } from 'vue';
import { requiredRule } from './inputRules';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const userEmail = ref('');
    const router = useRouter();
    return {
      userEmail,
      requiredRule,
      onSubmit: async () => {
        try {
          await auth.passwordResetRequest(userEmail);
          await router.push({ name: 'passwordresetsent' });
        } catch (error) {}
      }
    };
  }
};
</script>

<template lang="pug">
.form-wrapper.row.q-pa-md.bg-grey-3
  .text-h5.col-12 Reset Password
  p
    | If you forgot your password, enter your email and we will send you a reset link.
  q-form.col-12.row.q-mb-sm.q-gutter-y-lg(@submit='onSubmit')
    q-input.col-12(
      v-model='userEmail',
      type='email',
      label='Email',
      lazy-rules,
      :rules='[requiredRule]',
      autocomplete='email'
    )
    q-btn.col-12(type='submit', color='primary') Reset Password

  .col-12.text-center.q-m-t
    router-link(to='login') Return to Sign In
</template>

<style lang="sass" scoped>
.form-wrapper
  flex-basis: 600px
  flex-grow: 0
  flex-shrink: 1
</style>
