<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { GalleryCard } from 'src/types';
import CountDown from './Countdown.vue';

export default defineComponent({
  name: 'AuctionCard',
  components: { CountDown },
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
          return 'deep-orange-5';
        case 'Platinum':
          return 'grey-4';
        default:
          return 'grey';
      }
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
          .text-subtitle1.heading.ellipsis {{ `${card.collectionTitle} #${card.mintNumber}` }}
        //- Tier badge
      .col-2.self-center(v-if='card.tier != "None"')
        q-badge.float-right.lt-md(rounded, :color='badgeColour')
        q-badge.float-right.gt-sm(rounded, :color='badgeColour') 
          .text-subtitle3 {{ card.tier }}
    //- Small cards details
    .row.q-mt-sm
      .col-9
        .col-auto.text-bold
          | Top Bid:
        .col-auto
          img.lc-currency.q-pr-xs(src='~assets/legalcoin-trimmed.png')
          .ellipsis {{ card.price }}
      .col
        .col-auto.text-bold
          .text-right Yield:
        .col-auto.float-right
          .text-subtitle4 {{ card.yield }}

    //- Countdown
    .row.q-mt-sm
      .col-12.text-grey-8
        CountDown(:endDate='new Date(card.saleclose)')
  q-separator.q-mb-xs.q-mx-x(inset)
  router-link(:to='{ name: "asset", params: { asset: card.id } }')
    q-img.asset-img-lg.zoom(
      :src='card.imageUrl',
      placeholder-src='~src/assets/LC-Placeholder.png'
    )
      template(v-slot:loading)
        .text-primary
          .q-pt-xl Loading...
          q-spinner
</template>

<style lang="sass" scoped>
.heading
  font-weight: bold
.values
  font-size: 1rem

.lc-currency
  height: 1em
</style>
