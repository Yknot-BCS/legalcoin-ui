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
    return {
      card,
      viewCard: true,
      viewInfo: false
    };
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
  },
  methods: {
    changeCard() {
      this.viewCard = !this.viewCard;
      this.viewInfo = !this.viewInfo;
      console.log(this.viewCard);
      console.log(this.viewInfo);
      this.$forceUpdate();
    }
  }
});
</script>

<template lang="pug">
q-card(v-if='viewCard')
  q-card-section.bg-white(style='z-index: 2')
    .row
      .col
        .row
          .text-h6.heading {{ card.name }}
        .row
          .col-auto
            .q-mr-sm {{ card.mintprice }} &#8226;
          .col-auto
            .text-subtitle4 {{ card.yield }} yield
      .col-4
        q-badge.text-subtitle2.float-right.text(rounded, :color='badgeColour') {{ card.tier }}
    .row
      q-btn(v-model='viewCard', color='red', @click='changeCard()')
        | Show Details
  q-separator(inset)
  router-link(
    :to='{ name: "template", params: { collection_name: card.collection, template_id: card.id } }'
  )
    q-img.asset-img.zoom(:src='card.imageUrl')
q-card(v-if='viewInfo')
  q-card-section.bg-white(style='z-index: 2')
    .row
      .col
        .row
          .text-h6.heading {{ card.name }}
        .row
          .col-auto
            .q-mr-sm {{ card.mintprice }} &#8226;
          .col-auto
            .text-subtitle4 {{ card.yield }} yield
      .col-4
        q-badge.text-subtitle2.float-right.text(rounded, :color='badgeColour') {{ card.tier }}
    .row
      q-btn(v-model='viewCard', color='red', @click='changeCard()')
        | Show Details
  q-separator(inset)
  q-card-section.asset-img
    .row
      .col.text-subtitle2
        .row
          .text-h6.heading
            | Details
        .row.justify-between.q-pb-md
          .col-auto
            | Max. supply:
          .col-auto
            | details.max_supply
        .row.justify-between.q-pb-md
          .col-auto
            | Issued supply:
          .col-auto
            | details.issued_supply
        .row.justify-between.q-pb-md
          .col-auto
            | Is transferable:
          .col-auto
            | details.is_transferable
        .row.justify-between.q-pb-md
          .col-auto
            | Is burnable:
          .col-auto
            | details.is_burnable
</template>

<style lang="sass" scoped>
.asset-img
  z-index: 1
  width: 100%
  height: 500px
  max-height: 400px
.column
  width: 100px
.heading
  font-weight: bold
.text
  margin-top: 15px
</style>
