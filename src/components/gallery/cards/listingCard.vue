<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { GalleryCard } from 'src/types';

export default defineComponent({
  name: 'ListingCard',
  components: {},
  props: {
    data: {
      type: Object as PropType<GalleryCard>,
      required: true
    }
  },
  setup(props) {
    const card = computed(() => props.data);
    return { card };
  }
});
</script>

<template lang="pug">
q-card
  q-card-section
    .text-h6.heading {{ card.name }}
    .text-subtitle2 {{ card.id }}
  q-separator(inset)
  q-img.asset-img(:src='card.imageUrl')
  q-card-actions
    q-btn(flat) Action 1
</template>

<style lang="sass" scoped>
.asset-img
  width: 100%
  height: 500px
  max-height: 400px
.heading
  font-weight: bold
</style>
