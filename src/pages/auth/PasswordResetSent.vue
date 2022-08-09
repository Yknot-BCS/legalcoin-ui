<script lang="ts">
import AuthCard from '../../components/auth/AuthCard.vue';

import { defineComponent } from 'vue';
export default defineComponent({
  name: 'PasswordResetSent',
  components: {
    AuthCard
  },
  setup() {
    return { userEmail: '' };
  },
  mounted() {
    this.userEmail = this.$route.params.email as string;
  }
});
</script>

<template lang="pug">
.row.justify-center
  AuthCard
    .text-h5.col-12.text-weight-bold Reset Link Sent
    p.q-mt-md
      | We have emailed a password reset link to &nbsp
      a(href='javascript:;') {{ userEmail }}.
      | &nbsp Check your email at this address to continue.
</template>

<style lang="sass" scoped></style>
