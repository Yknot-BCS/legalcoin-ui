<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { GalleryCard } from 'src/types';

export default defineComponent({
  name: 'AssetCard',
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
    .row
      .text-h6 {{ card.name }}
    .row
      .col-8
        .text-subtitle2 {{ card.mintprice }}
      .col-4
        .text-subtitle2.float-right {{ card.tier }}
    .row
      .text-subtitle2 Expected yield {{ card.yield }}
  q-separator(inset)
  router-link(:to='{ name: "asset", params: { asset: card.id } }')
    q-img.asset-img(:src='card.imageUrl')
  q-card-actions.q-pa-md
    q-btn.full-width(
      flat,
      color='primary',
      :to='{ name: "asset", params: { asset: card.id } }'
    ) View Asset
</template>

<style lang="sass" scoped>
.asset-img
  width: 100%
  height: 500px
  max-height: 400px
</style>
