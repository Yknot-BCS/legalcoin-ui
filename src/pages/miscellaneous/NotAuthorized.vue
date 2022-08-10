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
  div
    .text-black.text-h4.q-pb-lg(style='opacity: 0.8') You are not authorized! 🔐
    .text-black.text-h5(style='opacity: 0.4') You don’t have permission to access this page. Go Home!!
    q-btn.q-mt-lg(
      color='primary',
      text-color='white',
      unelevated,
      :to='{ name: "home" }',
      label='Back to Home',
      no-caps
    )
    .row.justify-center
      q-card.my-card(flat)
        img.auth-image.q-mr-md(src='~assets/not-authorized.svg')
</template>

<style scoped lang="sass">
.logo
  height:40px
.my-card
  width: 100%
  max-width: 350px
</style>
