<script lang="ts">
import { defineComponent, computed } from 'vue';
export default defineComponent({
  name: 'Description',
  components: {},
  props: {
    description: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const text = computed(() => props.description);
    return { text };
  }
});
</script>

<template lang="pug">
.row
  .col-12
    .text-body1 {{ text }}
</template>

<style lang="sass"></style>
