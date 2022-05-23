<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { GalleryCard } from 'src/types';

export default defineComponent({
  name: 'GalleryView',
  components: {},
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
    const type = computed(() => props.type);
    console.log(cards);
    return { cards };
  }
});
</script>

<template lang="pug">
.row.q-col-gutter-md.q-pa-md
  .col-xs-12.col-sm-6.col-md-4.col-lg-3.col-xl-2(
      v-for="card in cards"
      :key="card.id")
    q-card.asset-card(v-if="type === 'asset'")
      q-card-section
        .row
          .text-h6 {{card.collection}}
        .row
          .col-6
            .text-subtitle2 GBP 500
          .col-6
            .text-subtitle2.float-right {{card.id}}
        .row
          .text-subtitle2 Expected yield 15%
      q-separator(inset)
      q-img.asset-img(:src="card.imageUrl")

    q-card.asset-card(v-else-if="type === 'schema'")
      q-card-section
        .text-h6 {{card.name}}
        .text-subtitle2 {{card.id}}
      q-separator(inset)
      q-img.asset-img(:src="card.imageUrl")

    q-card.asset-card(v-else-if="type === 'template'")
      q-card-section
        .text-h6 {{card.name}}
        .text-subtitle2 {{card.id}}
      q-separator(inset)
      q-img.asset-img(:src="card.imageUrl")

    q-card.asset-card(v-else-if="type === 'collection'")
      q-card-section
        .text-h6 {{card.name}}
        .text-subtitle2 {{card.id}}
      q-separator(inset)
      q-img.asset-img(:src="card.imageUrl")
    
    q-card.asset-card(v-else-if="type === 'listing'")
      q-card-section
        .text-h6 {{card.name}}
        .text-subtitle2 {{card.id}}
      q-separator(inset)
      q-img.asset-img(:src="card.imageUrl")
  
</template>

<style lang="sass" scoped>

.asset-img
  width: 100%
  height: 500px
  max-height: 400px
</style>
