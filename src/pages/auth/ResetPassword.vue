<script lang="ts">
import { ref } from 'vue';
import { requiredRule } from './inputRules';

export default {
  setup() {
    const userPassword = ref('');
    function passwordMatchRule(val: string): string | boolean {
      return val === userPassword.value || 'Passwords do not match';
    }
    return {
      userPassword: ref(''),
      userRetypePassword: ref(''),
      requiredRule,
      passwordMatchRule,
      onSubmit: () => {
        console.log('submit');
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
      v-model='userRetypePassword',
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
