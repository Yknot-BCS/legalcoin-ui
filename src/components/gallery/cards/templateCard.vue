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
  transition(v-show='viewCard', appear, enter enter-to-class='animated flipInY', leave-to-class='animated flipOutY', mode='out-in', :duration='{ enter: 500, leave: 500}')
    q-card.box
      //- Desktop
      q-card-section.bg-white.kee(style='z-index: 2, height: 3rem')(v-if='$q.screen.gt.sm')
        .row.col.justify-between
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
        q-img.asset-img-lg.zoom(v-if='$q.screen.gt.sm', :src='card.imageUrl')
        q-img.asset-img-md.zoom(
          v-if='$q.screen.lt.md && $q.screen.gt.xs',
          :src='card.imageUrl'
        )
        q-img.asset-img-sm.zoom(
          v-if='$q.screen.lt.sm',
          :src='card.imageUrl'
        )
  transition(v-show='viewInfo', appear, enter-to-class='animated flipInY', leave-to-class='animated flipOutY', mode='in-out', :duration='{ enter: 500, leave: 500}')
      q-card.box
        //- Desktop
        .div(v-if='$q.screen.gt.sm')
          q-card-section.bg-white(style='z-index: 2')
            .row.col.justify-between
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
          q-card-section.asset-img-lg
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
        //- Mobile
        .div(v-else)
          q-card-section.bg-white(style='z-index: 2')
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
          q-card-section.asset-img-md(v-if='$q.screen.lt.md && $q.screen.gt.xs')
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
                  | Is Burnable:
                .col-auto
                | ???
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
.asset-container
  display: grid
.box
  grid-row: 1
  grid-column: 1
</style>
