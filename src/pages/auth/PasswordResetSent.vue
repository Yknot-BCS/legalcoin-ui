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
AuthCard
  .text-h5.col-12.text-weight-bold Reset Link Sent
  p.q-mt-md
    | We have emailed a password reset link to [email]. Click that link to continue.
</template>

<style lang="sass" scoped></style>
