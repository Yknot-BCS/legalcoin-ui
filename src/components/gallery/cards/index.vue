<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { GalleryCard } from 'src/types';
import AssetCard from './assetCard.vue';
import CollectionCard from './collectionCard.vue';
import ListingCard from './listingCard.vue';
import TemplateCard from './templateCard.vue';

export default defineComponent({
  name: 'Cards',
  components: { AssetCard, CollectionCard, ListingCard, TemplateCard },
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
div(v-if='cardType === "asset"')
  AssetCard(:data='card')

div(v-else-if='cardType === "template"')
  TemplateCard(:data='card')

div(v-else-if='cardType === "collection"')
  CollectionCard(:data='card')

div(v-else-if='cardType === "listing"')
  ListingCard(:data='card')
</template>

<style lang="sass" scoped></style>
