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
  q-card-section
    .row
      .col-10
        //- Title of cards
        .row(v-if='$q.screen.gt.xs')
          .text-body1.heading {{ card.name }}
        .row(v-else)
          .text-body2.heading {{ card.name }}
      .col-2(v-if='$q.screen.gt.xs')
        q-badge.text-subtitle2.float-right(rounded, :color='badgeColour') {{ card.tier }}
      //- Large cards details
    .row(v-if='$q.screen.gt.xs')
      .col
        .row
          .col-auto
            | Price:
          .col-auto
            | {{ card.price }}
        .row
          .col-auto
            | Yield:
          .col-auto
            .text-subtitle4 {{ card.yield }}
    //- Small cards details
    .row(v-else, style='font-size: 0.64rem')
      .col
        .row
          .col-auto
            | Price:
          .col-auto
            | {{ card.price }}
        .row
          .col-auto
            | Yield:
          .col-auto
            | {{ card.yield }}
    .row
      .col-12.q-py-sm
        q-badge.text-black(color='grey-3') {{ card.seller }}
    .row
      .col-12
        CountDown(:endDate='new Date(card.saleclose)')
  q-separator(inset)
  router-link(:to='card.to')
    q-img.row.asset-img-sm(v-if='$q.screen.lt.sm', :src='card.imageUrl')
      q-badge.text-subtitle2.text-sm(rounded, :color='badgeColour') {{ card.tier }}
    q-img.asset-img-lg(v-else, :src='card.imageUrl')
</template>

<style lang="sass" scoped>
.asset-img-lg
  width: 100%
  height: 500px
  max-height: 400px
.asset-img-sm
  width: 100%
  height: 500px
  max-height: 200px
.heading
  font-weight: bold
.column
  width: 95px
.text
  margin-top: 15px
.text-sm
  margin-top: 15px
  margin-left: 10px
  max-height: 30px
</style>
