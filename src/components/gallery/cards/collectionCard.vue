<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { GalleryCard } from 'src/types';

export default defineComponent({
  name: 'CollectionCard',
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
q-card(bordered)
  q-card-section.bg-white(style='z-index: 2')
    .text-h6.heading {{ card.name }}
  q-separator(inset)
  router-link(
    :to='{ name: "collection", params: { collection: card.collection } }'
  )
    .row.collection-card.zoom
      .col.self-center
        q-img.asset-img(:src='card.imageUrl')
</template>

<style lang="sass" scoped>
.asset-img
  z-index: 1
  width: 100%
  max-height: 400px
.heading
  font-weight: bold
.collection-card
  height: 400px
</style>
