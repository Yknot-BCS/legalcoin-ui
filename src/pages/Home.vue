<script lang="ts">
import { onMounted, computed, ref } from 'vue';
import Cards from 'src/components/gallery/cards/index.vue';
import { useStore } from 'src/store';
import { atomic_api, atomic_market_api } from 'src/api/atomic_assets';

export default {
  components: { Cards },
  setup() {
    const store = useStore();
    const assets = computed(() => store.state.buy.assets);
    onMounted(async () => {
      await store.dispatch('buy/updateAll');
    });
    return {
      assets,
      collections: ref([])
    };
  },

  methods: {
    async getAllCollections() {
      let collectionsfilter = {
        authorized_account: process.env.AA_ACCOUNT
      } as unknown;

      let collections = await atomic_api.getCollections(collectionsfilter);
      console.log(collections);
    }
  },
  async mounted() {
    console.log('Home mounted');
    let collectionsfilter = {
      authorized_account: process.env.AA_ACCOUNT,
      limit: 100
    } as unknown;

    let collections = await atomic_api.getCollections(collectionsfilter);
    console.log(collections);

    let trending = [];
    for (const collection of collections) {
      console.log(collection.collection_name);
      let templateStatsFilter = {
        symbol: 'WAX',
        search: collection.collection_name
      } as unknown;

      let templateStats = await atomic_market_api.getTemplatePriceStats(
        templateStatsFilter
      );
      console.log(templateStats);
    }
  }
};
</script>

<template lang="pug">
img.bg.tr.animated.fadeInLeft.slower(src='~assets/polygons/v1.svg')
img.bg-polygon.tr.animated.fadeInLeft.slower(src='~assets/polygons/v2.svg')
q-page.q-py-md
  .row
    .col-md-6.row.justify-end.items-center.q-px-lg
      h2.text-grey-1 Bringing the legal industry into the digital world
    .main-asset.col-md-6.q-pa-lg(v-if='assets.length > 0')
      Cards.rounded.shadow-10(:data='assets[0]', type='asset')

  .div
    .row.justify-center
      h2.text-grey-1 Featured Collections

    .row.justify-center
      .col-3.q-pa-lg(v-if='assets.length > 0')
        Cards.rounded.shadow-10(:data='assets[0]', type='collection')
      .col-3.q-pa-lg(v-if='assets.length > 0')
        Cards.rounded.shadow-10(:data='assets[0]', type='collection')
      .col-3.q-pa-lg(v-if='assets.length > 0')
        Cards.rounded.shadow-10(:data='assets[0]', type='collection')

  .div
    .row.justify-center
      h2.text-grey-1 Trending NFTs

    .row.justify-center
      .col-3.q-pa-lg(v-if='assets.length > 0')
        Cards.rounded.shadow-10(:data='assets[0]', type='template')
      .col-3.q-pa-lg(v-if='assets.length > 0')
        Cards.rounded.shadow-10(:data='assets[0]', type='template')
      .col-3.q-pa-lg(v-if='assets.length > 0')
        Cards.rounded.shadow-10(:data='assets[0]', type='template')
</template>

<style lang="sass" scoped>
h2
  max-width: 21ch
.main-asset
  flex-basis: 600px

.rounded
  border-radius: 1rem
  overflow: hidden

.bg
  position: absolute
  height: 100%
  left: 0rem
  z-index: -1
  &.tr
    right: 0rem
    top: 0rem
  &.br
    left: 0rem
    bottom: 0rem

.bg-polygon
  position: absolute
  left: 3rem
  bottom: 10rem
</style>

function getCollections() { throw new Error('Function not implemented.'); }
