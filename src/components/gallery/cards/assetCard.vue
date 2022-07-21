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
      .col-auto
        .q-mr-sm {{ card.mintprice }} &#8226;
      .col-auto
        .text-subtitle4 {{ card.yield }} yield

    //- Small cards details
    .row(v-else, style='font-size: 0.72rem')
      .col-auto
        | {{ card.mintprice }}
      .col-auto
        | &nbsp; &#8226; &nbsp; {{ card.yield }} yield

  q-separator(inset)
  router-link(:to='card.to')
    q-img.asset-img-sm(v-if='$q.screen.lt.sm', :src='card.imageUrl')
      q-badge.text-subtitle2.float-right.text-sm(rounded, :color='badgeColour') {{ card.tier }}
    q-img.asset-img-lg(v-else, :src='card.imageUrl')
</template>

<style lang="sass" scoped>
.asset-img
  width: 100%
  height: 500px
  max-height: 400px
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
