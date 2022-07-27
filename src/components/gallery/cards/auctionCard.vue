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
          return 'orange-14';
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
    q-badge.text-subtitle2.float-right.text(
      v-if='card.tier',
      rounded,
      :color='badgeColour'
    ) {{ card.tier }}
    .row
      .text-h6.heading {{ card.name }}
    .row
      .col-7
        .text-subtitle4.q-mr-sm {{ card.price }}
      .col-5
        .text-subtitle4.float-right {{ card.yield }} yield
    .row
      .col-12.q-py-sm
        q-badge.text-black(color='grey-3') {{ card.seller }}
    .row
      .col-12
        CountDown(:endDate='new Date(card.saleclose)')
  q-separator(inset)
  router-link(:to='card.to')
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
.column
  width: 95px
.text
  margin-top: 15px
</style>
