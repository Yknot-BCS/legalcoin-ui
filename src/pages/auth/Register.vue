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
      userName: ref(''),
      userSurname: ref(''),
      userEmail: ref(''),
      userPassword,
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
  .text-h5.col-12 Register
  q-form(@submit="onSubmit").col-12.row.q-mb-sm.q-gutter-y-lg
    q-input(
        v-model="userName"
        label="Name"
        lazy-rules
        :rules="[ requiredRule ]"
        autocomplete="given-name"
    ).col-6.q-pr-md
    q-input(
        v-model="userSurname"
        label="Surname"
        lazy-rules
        :rules="[ requiredRule ]"
        autocomplete="family-name"
    ).col-6
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
        autocomplete="new-password"
    ).col-12
    q-input(
        v-model="userRetypePassword"
        type="password"
        label="Retype Password"
        lazy-rules
        :rules="[ requiredRule, passwordMatchRule ]"
        autocomplete="new-password"
    ).col-12
    q-btn(type="submit" color="primary").col-12 Create an account
  .col-12.text-center
    span.q-mr-xs Already have an account?
    router-link(to="login") Login

</template>

<style lang="sass" scoped>
.form-wrapper
  flex-basis: 600px
  flex-grow: 0
  flex-shrink: 1
</style>
