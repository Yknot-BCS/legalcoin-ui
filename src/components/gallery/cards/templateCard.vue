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
          return 'deep-orange-5';
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
          .text-subtitle1.heading.ellipsis {{ card.name }}
      .col-2.self-center(v-if='card.tier != "None"')
        q-badge.float-right.lt-md(rounded, :color='badgeColour')
        q-badge.float-right.gt-sm(rounded, :color='badgeColour') 
          .text-subtitle3 {{ card.tier }}
    //- Small cards details
    .row.q-mt-sm
      .col-9
        .col-auto.text-bold
          | Price:
        .col-auto
          .row.no-wrap
            img.lc-currency.q-pr-xs(src='~assets/legalcoin-trimmed.png')
            .ellipsis {{ getPrice }}
      .col
        .col-auto.text-bold
          .text-right Yield:
        .col-auto.float-right
          .text-subtitle4 {{ card.yield }}

  router-link(
    :to='{ name: "template", params: { collection_name: card.collection, template_id: card.id } }'
  )
    q-img.zoom.asset-img(
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
.lc-currency
  height: 1em
</style>
