<script lang="ts">
import { useRouter } from 'vue-router';
export default {
  setup() {
    const router = useRouter();
    return {
      onContinue: async () => {
        await router.replace('/');
      }
    };
  }
};
</script>

<template lang="pug">
.form-wrapper.row.q-pa-md.bg-grey-3
  .text-h5.col-12 Password Reset Successful
  p
    | We have successfully set your new password. Click the button below to continue home.
  q-btn.col-12(@click='onContinue()', color='primary')
    | Continue
</template>

<style lang="sass" scoped>
.form-wrapper
  flex-basis: 600px
  flex-grow: 0
  flex-shrink: 1
</style>
