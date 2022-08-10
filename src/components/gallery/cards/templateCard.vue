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
    },
    getPrice() {
      if (this.card.price == undefined) {
        return this.card.mintprice;
      } else return this.card.price;
    }
  },
  methods: {
    changeCard() {
      this.viewCard = !this.viewCard;
      this.viewInfo = !this.viewInfo;
      this.$forceUpdate();
    }
  }
});
</script>

<template lang="pug">
.asset-container
  transition(
    v-show='viewCard',
    appear,
    enter,
    enter-to-class='animated flipInY',
    leave-to-class='animated flipOutY',
    mode='out-in',
    :duration='{ enter: 500, leave: 500 }'
  )
    q-card.box
      //- Desktop
      q-card-section.bg-white(style='z-index: 2')(v-if='$q.screen.gt.sm')
        .row.justify-between
          .col-8
            //- Title of cards
            .row
              .text-subtitle2.heading {{ card.name }}
              q-btn(color='red', @click='changeCard()', size='sm', flat)
                | ?
          .col-2
            q-badge.q-mb-xs.text-subtitle2.float-right(
              rounded,
              :color='badgeColour'
            ) {{ card.tier }}
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
      q-card-section.bg-white(style='z-index: 2')(v-else)
        .row.justify-between
          .col-8
            //- Title of cards
            .row
              .text-subtitle1.heading {{ card.name }}
              q-btn(color='red', @click='changeCard()', size='sm', flat)
                | ?
          .col-2.self-center
            q-badge.text-subtitle2.float-right(rounded, :color='badgeColour')
        //- Small cards details
        .row(style='font-size: 0.7rem')
          .col-8
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
      q-img.zoom(:src='card.imageUrl')

  transition(
    v-show='viewInfo',
    appear,
    enter-to-class='animated flipInY',
    leave-to-class='animated flipOutY',
    mode='in-out',
    :duration='{ enter: 500, leave: 500 }'
  )
    q-card.box.box-info
      //- Desktop
      q-card-section.bg-white(style='z-index: 2')(v-if='$q.screen.gt.sm')
        .row.justify-between
          .col-8
            //- Title of cards
            .row
              .text-subtitle2.heading {{ card.name }}
              q-btn(color='red', @click='changeCard()', size='sm', flat)
                | ?
          .col-2
            q-badge.q-mb-xs.text-subtitle2.float-right(
              rounded,
              :color='badgeColour'
            ) {{ card.tier }}
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
        q-card-section
          .div
            .row.heading
              | Details
            .row.justify-between.q-pb-sm
              .col-auto
                | Max Supply:
              .col-auto
                | ???
            .row.justify-between.q-pb-sm
              .col-auto
                | Issued Supply:
              .col-auto
                | ???
            .row.justify-between.q-pb-sm
              .col-auto
                | Is Transferable:
              .col-auto
                | ???
            .row.justify-between.q-pb-sm
              .col-auto
                | Is Burnable:
              .col-auto
              | ???
            .row.justify-between.q-pb-sm
              .col-auto
                | Tier
              .col-auto
              | {{ card.tier }}
      //- Mobile
      q-card-section.bg-white(style='z-index: 2')(v-else)
        .row.justify-between
          .col-8
            //- Title of cards
            .row
              .text-subtitle1.heading {{ card.name }}
              q-btn(color='red', @click='changeCard()', size='sm', flat)
                | ?
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
        q-card-section(v-if='$q.screen.lt.md && $q.screen.gt.xs')
          .div
            .row.heading
              | Details
            .row.justify-between.q-pb-sm
              .col-auto
                | Max Supply:
              .col-auto
                | ???
            .row.justify-between.q-pb-sm
              .col-auto
                | Issued Supply:
              .col-auto
                | ???
            .row.justify-between.q-pb-sm
              .col-auto
                | Is Transferable:
              .col-auto
                | ???
            .row.justify-between.q-pb-sm
              .col-auto
                | Is Burnable:
              .col-auto
              | ???
            .row.justify-between.q-pb-sm
              .col-auto
                | Tier
              .col-auto
              | {{ card.tier }}
        q-card-section.asset-img-sm(v-if='$q.screen.lt.sm')
          .div
            .row.heading
              | Details
            .row.justify-between.q-pb-sm
              .col-auto
                | Max Supply:
              .col-auto
                | ???
            .row.justify-between.q-pb-sm
              .col-auto
                | Issued Supply:
              .col-auto
                | ???
            .row.justify-between.q-pb-sm
              .col-auto
                | Is Transferable:
              .col-auto
                | ???
            .row.justify-between.q-pb-sm
              .col-auto
                | Tier
              .col-auto
              | {{ card.tier }}
</template>

<style lang="sass" scoped>
.heading
  font-weight: bold
.lc-currency
  height: 1em
.asset-container
  display: grid
.box
  grid-row: 1
  grid-column: 1
  height: 100%
// .box-info
//   height: 310.11px
</style>
