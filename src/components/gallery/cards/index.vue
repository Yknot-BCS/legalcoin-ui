<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { GalleryCard } from 'src/types';
import AssetCard from './assetCard.vue';
import CollectionCard from './collectionCard.vue';
import AuctionCard from './auctionCard.vue';
import TemplateCard from './templateCard.vue';

export default defineComponent({
  name: 'Cards',
  components: {
    AssetCard,
    CollectionCard,
    TemplateCard,
    AuctionCard
  },
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
div(v-if='card.type === "asset"')
  AssetCard(:data='card')

div(v-else-if='card.type === "template"')
  TemplateCard(:data='card')

div(v-else-if='card.type === "collection"')
  CollectionCard(:data='card')

div(v-else-if='card.type === "auction"')
  AuctionCard(:data='card')

div(v-else)
  AssetCard(:data='card')
</template>

<style lang="sass" scoped></style>
