<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Error404'
});
</script>

<template lang="pug">
.row.q-pt-lg.q-pl-lg
  router-link.row.items-center.cursor-pointer(:to='{ name: "home" }')
    img.logo.q-mr-md(src='~assets/legalcoin-full.png')

.fullscreen.text-white.text-center.q-pa-md.flex.flex-center
  .div.q-pt-lg
    .text-black.text-h4.q-pb-lg(style='opacity: 0.8') Page Not Found 🕵🏻‍♀️
    .text-black.text-h5.text-grey-7 Oops! 😖 The requested URL was not found on this server.
    q-btn.q-mt-lg.q-mb-md(
      color='primary',
      text-color='white',
      unelevated,
      :to='{ name: "home" }',
      label='Back to Home',
      no-caps
    )
    .row.justify-center
      q-card.my-card(flat)
        img.auth-image.q-mr-md(src='~assets/error.svg')
</template>

<style scoped lang="sass">
.logo
  height:40px
.my-card
  width: 100%
  max-width: 350px
</style>
