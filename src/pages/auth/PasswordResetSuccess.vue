<script lang="ts">
import AuthCard from '../../components/auth/AuthCard.vue';

import { defineComponent } from 'vue';
export default defineComponent({
  components: {
    AuthCard
  },
  setup() {
    return {};
  }
});
</script>

<template lang="pug">
.row.justify-center
  AuthCard.col
    .text-h5.col-12.text-weight-bold Password Reset Successful
    p.q-my-md
      | We have successfully set your new password. Click the button below to log in.
    q-btn.col-12(:to='{ name: "login" }', color='primary')
      | Continue To Login
</template>

<style lang="sass" scoped>
.form-wrapper
  flex-basis: 600px
  flex-grow: 0
  flex-shrink: 1
</style>
