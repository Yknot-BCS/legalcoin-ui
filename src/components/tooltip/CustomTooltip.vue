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
q-tooltip.row.tooltip(
  anchor='center right',
  self='center middle',
  style='background: rgba(0, 0, 0, 0)'
) 
  .col
    .row
      .bg-primary.q-px-xs(style='border-radius: 5px 5px 5px 5px')
        | {{ text }}
    .row.justify-center
      .col.tritest.justify-center
</template>

<style lang="sass">
.tritest
  width: 10px
  height: 20px
  background: red
  clip-path: polygon(0% 0%, 100% 0%, 50% 100%)
</style>
