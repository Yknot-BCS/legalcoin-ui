<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { GalleryCard } from 'src/types';

export default defineComponent({
  name: 'TemplateCard',
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
    q-img.asset-img.zoom(:src='card.imageUrl')
</template>

<style lang="sass" scoped>
.asset-img
  z-index: 1
  width: 100%
  height: 500px
  max-height: 400px
.heading
  font-weight: bold
</style>
