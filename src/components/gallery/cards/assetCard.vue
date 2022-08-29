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
  },
  computed: {
    badgeColour() {
      switch (this.card.tier) {
        case 'Silver':
          return 'grey';
        case 'Gold':
          return 'yellow-7';
        case 'Bronze':
          return 'orange-14';
        case 'Platinum':
          return 'grey-4';
        default:
          return 'grey';
      }
    },
    getPrice() {
      if (this.card.price == undefined) {
        return this.card.mintprice;
      } else return this.card.price;
    }
  }
});
</script>

<template lang="pug">
q-card
  q-card-section.bg-white(style='z-index: 2')
    .row
      .col-10
        //- Title of cards
        .row
          .text-subtitle1.heading {{ `${card.collectionTitle} #${card.mintNumber}` }}
      .col-2.self-center
        q-badge.float-right.lt-md(rounded, :color='badgeColour')
        q-badge.float-right.gt-sm(rounded, :color='badgeColour') 
          .text-subtitle3 {{ card.tier }}
    //- Small cards details
    .row.q-mt-sm
      .col-9
        .col-auto.text-bold
          | Price:
        .col-auto
          img.lc-currency.q-pr-xs(src='~assets/legalcoin-trimmed.png')
          | {{ getPrice }}
      .col
        .col-auto.text-bold
          .text-right Yield:
        .col-auto.float-right
          .text-subtitle4 {{ card.yield }}

  router-link(:to='{ name: "asset", params: { asset: card.id } }')
    q-img.zoom.asset-img(
      :src='card.imageUrl',
      placeholder-src='~src/assets/LC-Placeholder.png'
    )
      template(v-slot:loading)
        .text-primary
          q-spinner-ios.q-pt-lg
          .q-pt-sm Loading...
</template>

<style lang="sass" scoped>
.heading
  font-weight: bold

.lc-currency
  height: 1em
</style>
