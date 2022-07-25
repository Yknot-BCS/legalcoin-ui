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
  q-card-section(v-if='$q.screen.gt.sm')
    .row.col
      .col-10
        //- Title of cards
        .row
          .text-body1.heading {{ card.name }}
    .col-2
      q-badge.text-subtitle2.badge-lg.float-right(
        rounded,
        :color='badgeColour'
      ) {{ card.tier }}
    //- Large cards details
    .row
      .col
        .row
          .col-auto
            | Price:
          .col-auto
            | {{ getPrice }}
        .row
          .col-auto
            | Yield:
          .col-auto
            .text-subtitle4 {{ card.yield }}
  q-card-section(v-else)
    .row
      .col-10
        //- Title of cards
        .row
          .text-body2.heading {{ card.name }}

    //- Small cards details
    .row(style='font-size: 0.64rem')
      .col
        .row
          .col-auto
            | Price:
          .col-auto
            | {{ getPrice }}
        .row
          .col-auto
            | Yield:
          .col-auto
            | {{ card.yield }}

  q-separator(inset)
  router-link(:to='card.to')
    q-img.row.asset-img-sm(v-if='$q.screen.lt.md', :src='card.imageUrl')
      q-badge.text-subtitle1.badge-sm(rounded, :color='badgeColour') {{ card.tier }}
    q-img.asset-img-lg(v-else, :src='card.imageUrl')
</template>

<style lang="sass" scoped>
.asset-img-lg
  width: 100%
  height: 20rem
.asset-img-sm
  width: 100%
  height: 10rem
.column
  width: 100px
.heading
  font-weight: bold
.badge-lg
  padding: 5px 5px 5px 5px
  font-size: 1rem
.badge-sm
  margin-top: 10px
  margin-left: 10px
  padding: 0px 5px 0px 5px
  max-height: 30px
</style>
