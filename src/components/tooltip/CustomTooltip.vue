<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'TxCard',
  components: {},
  props: {
    text: {
      type: String,
      required: true
    }
  }
});
</script>

<template lang="pug">
q-tooltip.row.justify-center.tooltip(
  anchor='top middle',
  self='center middle',
  style='background: rgba(0, 0, 0, 0)'
) 
  .col
    .row
      .bg-primary.q-px-xs(style='border-radius: 5px 5px 5px 5px')
        | {{ text }}
    .row
      .col-5
      .col.tritest(style='max-width: 10px')
      .col-5
</template>

<style lang="sass">
.tritest
  height: 8px
  background: $primary
  clip-path: polygon(0% 0%, 100% 0%, 50% 100%)
</style>
