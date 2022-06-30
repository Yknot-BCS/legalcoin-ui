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
    q-badge.text-subtitle2.float-right(
      rounded,
      color='primary',
      label=' Silver'
    )
    .row
      .text-h6.heading {{ card.name }}
    .row
      .col-2.column
        .text-subtitle4 {{ card.mintprice }} &#8226;
      .col-2.column
        .text-subtitle4 {{ card.yield }} yield
  q-separator(inset)
  router-link(:to='{ name: "asset", params: { asset: card.id } }')
    q-img.asset-img(:src='card.imageUrl')
</template>

<style lang="sass" scoped>
.asset-img
  width: 100%
  height: 500px
  max-height: 400px
.heading
  font-weight: bold
.column
  width: 95px
</style>
