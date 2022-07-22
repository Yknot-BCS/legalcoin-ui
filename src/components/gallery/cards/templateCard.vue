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
            | {{ getPrice }}
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
            | {{ getPrice }}
        .row
          .col-auto
            | Yield:
          .col-auto
            | {{ card.yield }}

  q-separator(inset)
  router-link(
    :to='{ name: "template", params: { collection_name: card.collection, template_id: card.id } }'
  )
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
.column
  width: 100px
.heading
  font-weight: bold
.text
  margin-top: 15px
.text-sm
  margin-top: 15px
  margin-left: 10px
  max-height: 30px
</style>
