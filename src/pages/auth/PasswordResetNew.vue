<script lang="ts">
import auth from 'src/auth';
import { ref } from 'vue';
import { requiredRule } from './inputRules';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const userPassword = ref('');
    function passwordMatchRule(val: string): string | boolean {
      return val === userPassword.value || 'Passwords do not match';
    }
    return {
      userPassword,
      userPasswordConfirm: ref(''),
      requiredRule,
      passwordMatchRule,
      onSubmit: async () => {
        await auth.passwordResetNew(
          route.query['resetToken'] as string,
          userPassword.value
        );
      }
    };
  }
};
</script>

<template lang="pug">
.form-wrapper.row.q-pa-md.bg-grey-3
  .text-h5.col-12 Reset Password
  q-form.col-12.row.q-mb-sm.q-gutter-y-lg(@submit='onSubmit')
    q-input.col-12(
      v-model='userPassword',
      type='password',
      label='Password',
      lazy-rules,
      :rules='[requiredRule]',
      autocomplete='new-password'
    )
    q-input.col-12(
      v-model='userPasswordConfirm',
      type='password',
      label='Retype Password',
      lazy-rules,
      :rules='[requiredRule, passwordMatchRule]',
      autocomplete='new-password'
    )
    q-btn.col-12(type='submit', color='primary') Reset Password
</template>

<style lang="sass" scoped>
.form-wrapper
  flex-basis: 600px
  flex-grow: 0
  flex-shrink: 1
</style>
