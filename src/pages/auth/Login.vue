<script lang="ts">
import { ref } from 'vue';
import { requiredRule } from './inputRules';

export default {
  setup() {
    return {
      userEmail: ref(''),
      userPassword: ref(''),
      requiredRule,
      onSubmit: () => {
        console.log('submit');
      }
    };
  }
};
</script>

<template lang="pug">
.form-wrapper.row.q-pa-md.bg-grey-3
  .text-h5.col-12 Login
  q-form(@submit="onSubmit").col-12.row.q-mb-sm.q-gutter-y-lg
    q-input(
        v-model="userEmail"
        label="Email"
        lazy-rules
        :rules="[ requiredRule ]"
    ).col-12
    q-input(
        v-model="userPassword"
        type="password"
        label="Password"
        lazy-rules
        :rules="[ requiredRule ]"
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
