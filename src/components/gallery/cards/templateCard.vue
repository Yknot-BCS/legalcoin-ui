<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { GalleryCard } from 'src/types';

export default defineComponent({
  name: 'TemplateCard',
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
  //- Desktop
  q-card-section(v-if='$q.screen.gt.sm')
    .row.col
      .col-10
        //- Title of cards
        .row
          .text-subtitle2.heading {{ card.name }}
      .col-2
        q-badge.text-subtitle2.float-right(rounded, :color='badgeColour') {{ card.tier }}
    //- Large cards details
    .row(style='font-size: 0.7rem')
      .col-8
        .col-auto.text-bold
          | Price:
        .col-auto.values
          img.q-pr-xs(
            src='~assets/legalcoin-trimmed.png',
            style='height: 10px'
          )
          | {{ getPrice }}
      .col
        .col-auto.text-bold
          .text-right Yield:
        .col-auto.float-right.values
          .text-subtitle4 {{ card.yield }}
  //- Mobile
  q-card-section(v-else)
    .row
      .col-10
        //- Title of cards
        .row
          .text-subtitle1.heading {{ card.name }}
      .col-2.self-center
        q-badge.text-subtitle2.float-right(rounded, :color='badgeColour')
    //- Small cards details
    .row(style='font-size: 0.7rem')
      .col-10
        .col-auto.text-bold
          | Price:
        .col-auto
          img.q-pr-sm(
            src='~assets/legalcoin-trimmed.png',
            style='height: 10px'
          )
          | {{ getPrice }}
      .col
        .col-auto.text-bold
          .text-right Yield:
        .col-auto.float-right
          .text-subtitle4 {{ card.yield }}

  router-link(
    :to='{ name: "template", params: { collection_name: card.collection, template_id: card.id } }'
  )
    q-img.asset-img-lg(v-if='$q.screen.gt.sm', :src='card.imageUrl')
    q-img.asset-img-md(
      v-if='$q.screen.lt.md && $q.screen.gt.xs',
      :src='card.imageUrl'
    )
    q-img.asset-img-sm(v-if='$q.screen.lt.sm', :src='card.imageUrl')
</template>

<style lang="sass" scoped>
.asset-img-lg
  width: 100%
  height: 20rem
.asset-img-md
  width: 100%
  height: 15rem
.asset-img-sm
  width: 100%
  height: 10rem
.column
  width: 100px
.heading
  font-weight: bold
.values
  font-size: 1rem
</style>
