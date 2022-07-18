<script lang="ts">
import AuthCard from '../../components/auth/AuthCard.vue';

import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
export default defineComponent({
  components: {
    AuthCard
  },
  setup() {
    const router = useRouter();
    return {
      onContinue: async () => {
        await router.replace('/');
      }
    };
  }
});
</script>

<template lang="pug">
AuthCard
  .text-h5.col-12.text-weight-bold Password Reset Successful
  p.q-my-md
    | We have successfully set your new password. Click the button below to continue home.
  q-btn.col-12(@click='onContinue()', color='primary')
    | Continue To Home
</template>

<style lang="sass" scoped>
.form-wrapper
  flex-basis: 600px
  flex-grow: 0
  flex-shrink: 1
</style>
