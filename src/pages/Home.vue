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
import { useQuasar } from 'quasar';

export default defineComponent({
  components: { Cards },
  setup() {
    const $q = useQuasar();
    const screenWidth = computed(() => $q.screen.width);
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
      trendingTemplates: ref<GalleryCard[]>([] as GalleryCard[]),
      screenWidth
    };
  },
  computed: {
    numberOfCards(): number {
      let numberOfCards = Math.floor(this.$q.screen.width / 375);
      if (numberOfCards > 3) {
        numberOfCards = 3;
      } else {
        numberOfCards = numberOfCards;
      }
      return numberOfCards;
    }
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
        let templateStatsFilter = {
          symbol: 'WAX',
          search: collection.collection_name
        } as unknown;

        let templateStats: any = await atomic_market_api.fetchEndpoint(
          '/v1/stats/templates',
          templateStatsFilter
        );
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
  .row.justify-center
    .col-md-6.row.justify-start.items-center.q-px-lg
      .column
        h2.text-grey-1 Bringing the legal industry into the digital world
        .row.justify-start
          q-btn(
            :to='{ name: "discover" }',
            label='Explore Now',
            color='primary',
            size='lg'
          )
          q-btn.q-ml-sm(
            :to='{ name: "login" }',
            label='Sign In',
            size='lg',
            outline,
            color='secondary'
          )
    .main-asset.col-md-6.q-pa-lg(v-if='assets.length > 0')
      Cards.rounded.shadow-10(:data='assets[0]', type='asset')

  .div
    .row.justify-center
      h2.text-grey-1.text-center Featured Collections

    .row.justify-center
      .featured-card.q-pa-sm(
        v-for='collection in storecollections.slice(0, numberOfCards)',
        v-if='storecollections.length > 0'
      )
        Cards.rounded.shadow-10(:data='collection', type='collection')

    .row.justify-center.q-mt-md
      q-btn(
        :to='{ name: "discover" }',
        label='Explore More',
        color='primary',
        size='lg'
      )

  .div
    .row.justify-center
      h2.text-grey-1.text-center Trending NFTs

    .row.justify-center
      .featured-card.q-pa-sm(
        v-for='template in trendingTemplates.slice(0, numberOfCards)',
        v-if='trendingTemplates.length > 0'
      )
        Cards.rounded.shadow-10(:data='template', type='template')

    .row.justify-center.q-mt-md
      q-btn(
        :to='{ name: "discover" }',
        label='Explore More',
        color='primary',
        size='lg'
      )
</template>

<style lang="sass" scoped>
h2
  max-width: 21ch
.main-asset
  flex-basis: 600px

.featured-card
  width: 375px

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
