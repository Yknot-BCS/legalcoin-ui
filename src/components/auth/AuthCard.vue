<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({});
</script>

<template lang="pug">
.q-pa-lg.bg-primary.shadow-10.no-border-radius
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
