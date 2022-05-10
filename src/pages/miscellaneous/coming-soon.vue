<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Error404'
});
</script>

<template lang="pug">
.row.q-pt-lg.q-pl-lg.q-mb-lg
  router-link(to="/").row.items-center.cursor-pointer
    img.logo.q-mr-md(src="~assets/legalcoin-full.png")

div.fullscreen.text-white.text-center.q-pa-xl.flex.flex-center
  .div.q-pt-lg
    div.text-black.text-h4.q-pb-lg( style="opacity:.8") We are launching soon 🚀
    div.text-black.text-h5.text-grey-7 We're creating something awesome. We will be ready in no time!
    q-btn.q-mt-lg.q-mb-md(
      color="primary"
      text-color="white"
      unelevated
      to="/"
      label="Back to Home"
      no-caps
    )
    .row.justify-center
      q-card(class="my-card" flat )
        img.q-mr-md(src="~assets/error.svg")
</template>

<style scoped lang="sass">
.logo
  height:40px

.my-card
  width: 100%
  max-width: 350px
</style>
