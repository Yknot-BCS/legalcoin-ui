<script lang="ts">
export default {
  setup() {
    return {};
  }
};
</script>

<template lang="pug">
.row.justify-center
  .form-wrapper.row.q-pa-md.bg-grey-3
    .text-h5.col-12 Email Verification Succeeded
    p
      | We have successfully verified your email address. Click the button below to continue home.
    q-btn.col-12(:to='{ name: "login" }', color='primary')
      | Continue
</template>

<style lang="sass" scoped>
.form-wrapper
  flex-basis: 600px
  flex-grow: 0
  flex-shrink: 1
</style>
