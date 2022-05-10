<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Error404'
});
</script>

<template lang="pug">
.row.q-pt-lg.q-pl-lg
  router-link(to="/").row.items-center.cursor-pointer
    img.HL__logo.q-mr-md(src="~assets/legalcoin-full.png")


div.fullscreen.text-white.text-center.q-pa-md.flex.flex-center
  div
    div(style="font-size: 30vh") 404
    div.text-h2( style="opacity:.4") Oops. Nothing here...
    q-btn.q-mt-xl(
      color="white"
      text-color="blue"
      unelevated
      to="/"
      label="Go Home"
      no-caps
    )
</template>
