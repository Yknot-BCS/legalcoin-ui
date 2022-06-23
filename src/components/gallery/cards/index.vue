<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { GalleryCard } from 'src/types';
import AssetCard from './assetCard.vue';
import CollectionCard from './collectionCard.vue';
import ListingCard from './listingCard.vue';
import TemplateViewer from './templateCard.vue';

export default defineComponent({
  name: 'Cards',
  components: { AssetCard, CollectionCard, ListingCard, TemplateViewer },
  props: {
    data: {
      type: Object as PropType<GalleryCard>,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const card = computed(() => props.data);
    const cardType = computed(() => props.type);
    return { card, cardType };
  }
});
</script>

<template lang="pug">
div(v-if='cardType === "Assets"')
  AssetCard(:data='card')

div(v-else-if='cardType === "Templates"')
  TemplateViewer(:data='card')

div(v-else-if='cardType === "Collections"')
  CollectionCard(:data='card')

div(v-else-if='cardType === "Listings"')
  ListingCard(:data='card')
</template>

<style lang="sass" scoped></style>
