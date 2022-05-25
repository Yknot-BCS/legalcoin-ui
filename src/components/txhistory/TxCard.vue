<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'TxCard',
  components: {},
  props: {
    description: {
      type: String,
      required: true
    }
  },
  setup() {
    return {};
  }
});
</script>

<template lang="pug">
.row
  .col-12
    | o/
</template>

<style lang="sass"></style>
