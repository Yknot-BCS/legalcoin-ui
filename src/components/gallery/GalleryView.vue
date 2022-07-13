<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { GalleryCard } from 'src/types';
import Cards from 'src/components/gallery/cards/index.vue';

export default defineComponent({
  name: 'GalleryView',
  components: { Cards },
  props: {
    data: {
      type: Array as PropType<GalleryCard[]>,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const cards = computed(() => props.data);
    const cardType = computed(() => props.type);
    return { cards, cardType };
  }
});
</script>

<template lang="pug">
.row.q-col-gutter-md.q-pa-md
  .col-xs-12.col-sm-6.col-md-4.col-lg-3.col-xl-2(
    v-for='card in cards',
    :key='card.id'
  )
    Cards(:data='card', :type='cardType')
  .col-12(v-if='cards.length === 0')
    q-card.noItems
      .text-h4.text-center No items to display
</template>

<style lang="sass" scoped>
.asset-img
  width: 100%
  height: 500px
  max-height: 400px
.noItems
  padding: 100px 0px 100px 0px
</style>
