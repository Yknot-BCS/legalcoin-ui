<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({});
</script>

<template lang="pug">
.page-wrapper
  q-card.q-pa-lg.bg-grey-1.shadow-10.animated.fadeInDown.login-card
    slot
</template>

<style lang="sass" scoped>
.page-wrapper
  flex-basis: 600px
  flex-grow: 0
  flex-shrink: 1
.skip-link
  text-decoration: none
  font-style: italic
  color: black
</style>
