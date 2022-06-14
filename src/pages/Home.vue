<script lang="ts">
import { defineComponent, onMounted, computed, ref } from 'vue';
import Cards from 'src/components/gallery/cards/index.vue';
import { useStore } from 'src/store';
import { atomic_api, atomic_market_api } from 'src/api/atomic_assets';
import {
  ICollection,
  ITemplate
} from 'atomicassets/build/API/Explorer/Objects';
import { GalleryCard } from 'src/types';
import { getYield } from 'src/store/buy/actions';

export default defineComponent({
  components: { Cards },
  setup() {
    const store = useStore();
    const assets = computed(() => store.state.buy.assets);
    const storecollections = computed(() => store.state.buy.collections);
    onMounted(async () => {
      await store.dispatch('buy/updateAll');
    });
    return {
      assets,
      storecollections,
      collections: ref<ICollection[]>(new Object({}) as ICollection[]),
      trendingTemplates: ref<GalleryCard[]>([] as GalleryCard[])
    };
  },

  methods: {
    async getAllCollections() {
      let collectionsfilter = {
        authorized_account: process.env.AA_ACCOUNT,
        limit: 100,
        order: 'desc',
        sort: 'created'
      } as unknown;

      this.collections = await atomic_api.getCollections(collectionsfilter);
      console.log('col', this.collections);
    },
    async getTrendingNFTs() {
      let trending = [];
      for (const collection of this.collections) {
        console.log(collection.collection_name);
        let templateStatsFilter = {
          symbol: 'WAX',
          search: collection.collection_name
        } as unknown;

        let templateStats: any = await atomic_market_api.fetchEndpoint(
          '/v1/stats/templates',
          templateStatsFilter
        );
        // console.log(templateStats);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        trending.push(...templateStats?.results);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      let data = trending.map((t) => t.template as ITemplate);

      this.trendingTemplates = data.map((template) => {
        return {
          ...template.immutable_data,
          to: `/template/${template.collection.collection_name}/${template.template_id}`,
          yield: getYield(
            template.immutable_data.mintprice,
            template.immutable_data.maturedvalue
          ),
          name: template.collection.name,
          imageUrl:
            template.immutable_data.img &&
            (template.immutable_data.img as string).includes('http')
              ? (template.immutable_data.img as string)
              : 'https://ipfs.io/ipfs/' +
                (template.immutable_data.img as string),
          collection: template.collection.collection_name,
          template: '',
          schema: '',
          id: template.template_id
        } as GalleryCard;
      });
      console.log('trending', this.trendingTemplates);
    }
  },
  async mounted() {
    console.log('Home mounted');
    await this.getAllCollections();
    await this.getTrendingNFTs();
  }
});
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
      .col-3.q-pa-sm(
        v-for='collection in storecollections.slice(0, 3)',
        v-if='storecollections.length > 0'
      )
        Cards.rounded.shadow-10(:data='collection', type='collection')

  .div
    .row.justify-center
      h2.text-grey-1 Trending NFTs

    .row.justify-center
      .col-3.q-pa-sm(
        v-for='template in trendingTemplates.slice(0, 3)',
        v-if='trendingTemplates.length > 0'
      )
        Cards.rounded.shadow-10(:data='template', type='template')
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
