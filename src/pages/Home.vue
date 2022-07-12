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
    const isLoggedIn = computed((): boolean => store.state.account.isLoggedIn);
    onMounted(async () => {
      await store.dispatch('buy/updateAll');
    });
    return {
      isLoggedIn,
      assets,
      storecollections,
      collections: ref<ICollection[]>(new Object({}) as ICollection[]),
      trendingTemplates: ref<GalleryCard[]>([] as GalleryCard[]),
      screenWidth
    };
  },
  computed: {
    numberOfCards(): number {
      let numberOfCards = Math.floor(this.$q.screen.width / 340);
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
          symbol: process.env.LC_SYMBOL,
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
              : process.env.IPFS_ENDPOINT +
                '/ipfs/' +
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
q-page
  //- Top section
  .row
    .col-12.col-md-6
      .landing-left.q-pa-lg
        h2.landing-heading Fund some of the most worthy Class Action Lawsuits with LegalCoin.
        p.landing-subheading Giving you access to the justice you deserve. Play a role in bringing large conglomorates to justice by funding cases such as the diesel emissions scandal.
        .text-center
          q-btn.q-px-xl.q-ma-sm(
            :to='{ name: "discover" }',
            label='Discover',
            color='primary',
            size='lg'
          )
          q-btn.q-px-xl.q-ma-sm(
            :to='{ name: "login" }',
            label='Learn More',
            size='lg',
            outline,
            color='primary',
            v-if='!isLoggedIn'
          )
    .col-12.col-md-6.pgb
      .landing-right
        .landing-right-card-container
          .main-asset.col-md-6.q-pa-lg(v-if='assets.length > 0')
            Cards(:data='assets[0]', type='Assets')

    //- Featured Collections
  .div
    .row.justify-center
      h2.text-grey-9.text-center Featured Collections

    .row.justify-center
      .featured-card.q-pa-sm(
        v-for='collection in storecollections.slice(0, numberOfCards)',
        v-if='storecollections.length > 0'
      )
        Cards.rounded.shadow-10(:data='collection', type='Collections')

    .row.justify-center.q-mt-md
      q-btn(
        :to='{ name: "discover" }',
        label='Explore More',
        color='primary',
        size='lg'
      )

  .div
    .row.justify-center
      h2.text-grey-9.text-center Trending NFTs

    .row.justify-center
      .featured-card.q-pa-sm(
        v-for='template in trendingTemplates.slice(0, numberOfCards)',
        v-if='trendingTemplates.length > 0'
      )
        Cards.rounded.shadow-10(:data='template', type='Templates')

    .row.justify-center.q-mt-md
      q-btn(
        :to='{ name: "discover" }',
        label='Explore More',
        color='primary',
        size='lg'
      )
</template>

<style lang="sass" scoped>
.pgb
  position: relative

.rounded
  border-radius: 1rem
  overflow: hidden
.landing-heading
  color: $grey-9
  text-align: center
.landing-subheading
  font-family: "ralewayregular"
  font-size: 1.5rem
  text-align: center

@media (min-width: $breakpoint-sm-max)
  .landing-left
    padding: 2rem
    padding-top: 5rem
    padding-left: 5rem
    text-align: center
    max-width: 45rem
    margin-left:10%

  .landing-right
    padding: 5rem
  .landing-right-card-container
    max-width:40rem

  .pgb::before
    content:' '
    position: absolute
    z-index: -1
    top: 0rem
    left: 25%
    right: 0rem
    bottom: 0rem
    background-image: url("~assets/polygons/polygon_home_trending_horizontal.svg")
    background-repeat: no-repeat
    background-size: cover
@media (max-width: $breakpoint-md-min)
  .landing-right
    margin-top: 10rem
  .pgb::before
    content:' '
    position: absolute
    z-index: -1
    top: 2rem
    left: 0rem
    right: 0rem
    bottom: 0rem
    background-image: url("~assets/polygons/polygon_home_trending_vertical.svg")
    background-repeat: no-repeat
    background-size: cover
.featured-card
  width: 340px
  // width: 20em
  height: 100%

.bg-container
  position: absolute
  left: 0
  right: 0
  top: 0
  bottom: 0
  overflow: hidden
  z-index: -1

.bg-container-bg
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  background: #303030
  z-index: -2

.bg
  position: absolute
  left: 0rem
  width: 100%
  z-index: -1
  background: #fff
</style>
