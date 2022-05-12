<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Auth'
});
</script>

<template lang="pug">
q-layout( view="hHh lpR fFf")
  div.logo-wrapper.row.justify-center.items-center
    router-link(to="/").cursor-pointer
      img.logo(src="~assets/legalcoin-full.png")
  q-page-container.row.justify-center
    router-view
</template>

<style lang="sass" scoped>
.logo-wrapper
  margin-top: 5vh
  .logo
    width: clamp(15rem, 60vw, 25rem)
</style>
