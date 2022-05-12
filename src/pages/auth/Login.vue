<script lang="ts">
import { ref } from 'vue';

export default {
  setup() {
    function inputRequired(val: string): string | boolean {
      return (val && val.length > 0) || 'Required';
    }
    return {
      userEmail: ref(''),
      userPassword: ref(''),
      inputRequired,
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
  q-form(@submit="onSubmit").col-12.row.q-mb-sm
    q-input(
        v-model="userEmail"
        label="Email"
        lazy-rules
        :rules="[ inputRequired ]"
    ).col-12
    q-input(
        v-model="userPassword"
        type="password"
        label="Password"
        lazy-rules
        :rules="[ inputRequired ]"
    ).col-12
    q-btn(type="submit" color="primary") Login
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
