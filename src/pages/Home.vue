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
      featuredCollections: ref<GalleryCard[]>([] as GalleryCard[]),
      collections: ref<ICollection[]>(new Object({}) as ICollection[]),
      trendingTemplates: ref<GalleryCard[]>([] as GalleryCard[]),
      screenWidth,
      totalBackers: ref(0),
      totalGBP: ref(0),
      totalCases: ref(0)
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
      // console.log(this.collections);
      this.featuredCollections = this.collections.map((collection) => {
        return {
          name: collection.data.name as string,
          imageUrl:
            collection.data.img &&
            (collection.data.img as string).includes('http')
              ? (collection.data.img as string)
              : process.env.IPFS_ENDPOINT +
                '/ipfs/' +
                (collection.data.img as string),
          collection: collection.collection_name,
          template: '',
          schema: '',
          id: collection.contract,
          type: 'collection'
        } as GalleryCard;
      });
      // console.log(this.featuredCollections);
    },
    async getTrendingNFTs() {
      let trending = [];
      for (const collection of this.collections) {
        let templateStatsFilter = {
          symbol: process.env.LC_SYMBOL,
          search: collection.collection_name
        } as unknown;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          id: template.template_id,
          type: 'template'
        } as GalleryCard;
      });
    },

    // Get number of backers
    async getNumberOfBackers() {
      // TODO this will break if more than 100 users are in the system, will have to page through
      let filter = {
        symbol: process.env.LC_SYMBOL
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let stats: any = await atomic_market_api.fetchEndpoint(
        '/v1/stats/accounts',
        filter
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      let accounts = stats.results;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      this.totalBackers = accounts.length;
    },

    // Get GBP currently invested
    async getGBPInvested() {
      let filter = {
        symbol: process.env.LC_SYMBOL
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let stats: any = await atomic_market_api.fetchEndpoint(
        `/v1/stats/accounts/${process.env.AA_ACCOUNT}`,
        filter
      );
      this.totalGBP =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        stats.result.sell_volume / 10 ** stats.symbol.token_precision;
    },

    // Get number of cases funded
    getNumberOfCases() {
      console.log(this.collections);
      this.totalCases = this.collections.length;
    }
  },
  async mounted() {
    console.log('As iron sharpens iron, so one person sharpens another.');
    await this.getAllCollections();
    await this.getTrendingNFTs();
    await this.getGBPInvested();
    await this.getNumberOfBackers();
    this.getNumberOfCases();
  }
});
</script>

<template lang="pug">
q-page
  //- Top section
  .row.bg-black.img-parent
    img.img1(v-if='$q.screen.gt.sm', src='~src/assets/bg_img_diag2.svg')
    .col-12.col-md-6.top
      .landing-left.q-pa-lg.float-right
        h2.landing-heading
          span.text-white You can fund class action &#32
          span.text-primary lawsuits &#32
          span.text-secondary today with LegalCoin
        p.landing-subheading.text-white
          | It's extremely expensive to take legal action against corporate giants. Class action lawsuits give everyday people power against large corporations that have caused them harm.
          span.text-bold 
            | And now LegalCoin is giving you access to justice by funding cases agains large conglomerates.
        .text-left
          q-btn.q-px-xl.q-ma-sm(
            :to='{ name: "buytokens", params: { status: "checkout" } }',
            label='FUND NOW',
            color='primary',
            size='lg'
          )
          q-btn.q-px-xl.q-ma-sm(
            href='https://docs-30.gitbook.io/legalcoin/',
            target='_blank',
            label='Learn More',
            size='lg',
            outline,
            color='primary'
          )
    .col-12.col-md-6.top
      .row.justify-center.feat-card
        .landing-right
          .landing-right-card-container
            .col-md-6.q-pa-lg(v-if='assets.length > 0')
              Cards(style='width: 25em', :data='assets[0]', type='Assets')

  //- Stats sections
  .row.q-py-sm
  .row.justify-center
    q-separator.q-mr-lg.q-pr-xs(vertical, color='black')
    .col-3.justify-center
      .text-left.text-primary.stats-titles Backers
      .text-left.stats-numbers {{ totalBackers }}
    q-separator.q-mr-lg.q-pr-xs(vertical, color='black')
    .col-4.justify-center
      .text-left.text-primary.stats-titles Currently Invested
      .text-left.stats-numbers &#163; {{ totalGBP }}
    q-separator.q-mr-lg.q-pr-xs(vertical, color='black')
    .col-3.justify-center
      .text-left.text-primary.stats-titles Cases Funded
      .text-left.stats-numbers {{ totalCases }}
  .row.q-py-sm

  //- Featured Collections
  .div.q-py-lg.bg-feat
    .row.justify-center
      h2.col.title-section.text-secondary
        span Featured &#32
        span.underline Collections
    .row.justify-center
      .featured-card.q-pa-sm(
        v-for='collection in featuredCollections.slice(0, numberOfCards)',
        v-if='featuredCollections.length > 0'
      )
        Cards.rounded.shadow-10(:data='collection', type='Collections')

    .row.justify-center.q-mt-md.q-pb-xl
      q-btn(
        :to='{ name: "discover" }',
        label='Explore More',
        color='primary',
        size='lg'
      )

  //- How to use LegalCoin
  .row.justify-center.q-pt-lg(style='height: 12rem') 
    h2.col.title-section.text-black 
      span How to use &#32
      span.underline LegalCoin
  .row.justify-center.q-pb-xl.q-px-xl.items-center
    .row.justify-center
      .col-4-lg
        img(src='~src/assets/Fund.svg')
      .col-4-lg 
        img(src='~src/assets/Trade.svg')
      .col-4-lg
        img(src='~src/assets/Claim.svg')

    //- Recommended for you
  .div.q-py-lg.bg-black.img-parent(style='height: 40rem')
    img.img1(v-if='$q.screen.gt.sm', src='~src/assets/bg_img_diag4.svg')
    .row.justify-center
      h2.col.title-section.text-black.top
        span Recommended &#32
        span.underline for you
    .row.justify-center
      .featured-card.q-pa-sm(
        v-for='template in trendingTemplates.slice(0, numberOfCards)',
        v-if='trendingTemplates.length > 0'
      )
        Cards.rounded.shadow-10(:data='template', type='Templates')

  .row.q-pt-lg.justify-center
    .col
      h3.text-black.text-center Become a third-party funder for legal cases and reap reasonable rewards
  .row.q-pb-xl.q-px-xl.justify-center.items-center
    .row.justify-center
      .col-4-lg.q-px-md
        img(src='~src/assets/ad-1.svg')
      .col-4-lg.q-px-md
        img(src='~src/assets/ad-2.svg')
      .col-4-lg.q-px-md
        img(src='~src/assets/ad-3.svg')
</template>

<style lang="sass" scoped>
.stats-titles
  font-size: 1.5rem
.stats-numbers
  font-size: 3rem
.underline
  text-decoration: underline
  text-decoration-color: $primary
.featured-collections
  padding: 2rem
  padding-top: 5rem
  padding-left: 5rem
  text-align: left
  margin-left:5%
.trending-NFTs
  padding: 2rem
  padding-top: 5rem
  padding-left: 5rem
  text-align: left
  margin-left:5%
.title-section
  margin-left: 5%
.top
  z-index: 5
.main-asset-cont
  float: left,
  position: relative,
  left: 50%
.main-asset-fixer
  float: right,
  position: relative,
  left: -50%
.pgb
  position: relative
.bg-feat
  position: relative
.bg-trend
  position: relative
  height: 40rem
.rounded
  border-radius: 1rem
  overflow: hidden
.landing-heading
  color: $grey-9
  text-align: left
.landing-subheading
  font-family: "ralewayregular"
  font-size: 1.0rem
  text-align: left
.featured-index
  z-index: 5
.landing-right
.img-parent
  position: relative
  bottom: 0
  right: 0
.img1
  position: absolute
  bottom: 0
  right: 0
  height: 100%
  background-size: cover
  z-index: 0
  // border: 1px green solid
.flipX
  transform: scaleX(-1)
.flipY
  transform: scaleY(-1)
.flip
  transform: scaleX(-1) scaleY(-1)

@media (min-width: $breakpoint-sm-max)
  .landing-left
    padding: 2rem
    padding-top: 5rem
    padding-left: 5rem
    text-align: center
    max-width: 45rem
    margin-left:10%

  .landing-right
    padding:10rem
    margin-right: auto
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
  .bg-feat::before
    content:' '
    position: absolute
    z-index: -1
    top: 0rem
    left: 0
    right: 0
    bottom: 0rem
    width: 100%
    background-image: url("~src/assets/bg_img_diag3.svg")
    background-repeat: no-repeat
    background-size: cover
  .bg-trend::before
    content:' '
    position: absolute
    z-index: -1
    top: 0
    left: 10%
    right: -40%
    bottom: 0rem
    transform: scaleX(-1)
    background-image: url("~assets/polygons/polygon_featured_horizontal.svg")
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
  .bg-feat::before
    content:' '
    position: absolute
    z-index: -1
    top: 0rem
    left: 0rem
    right: 0rem
    bottom: 0rem
    background-image: url("~src/assets/bg_img_diag3.svg")
    background-repeat: no-repeat
    background-size: cover
  .bg-trend::before
    content:' '
    position: absolute
    z-index: -1
    top: 0rem
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
