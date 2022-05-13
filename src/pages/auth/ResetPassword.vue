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
  q-form(@submit="onSubmit").col-12.row.q-mb-sm.q-gutter-y-lg
    q-input(
        v-model="userPassword"
        type="password"
        label="Password"
        lazy-rules
        :rules="[ requiredRule ]"
    ).col-12
    q-input(
        v-model="userRetypePassword"
        type="password"
        label="Retype Password"
        lazy-rules
        :rules="[ requiredRule, passwordMatchRule ]"
    ).col-12
    q-btn(type="submit" color="primary").col-12 Reset Password
  .col-12.text-center
    span.q-mr-xs Need an account?
    router-link(to="register") Register

</template>

<style lang="sass" scoped>
.form-wrapper
  flex-basis: 600px
  flex-grow: 0
  flex-shrink: 1
</style>
