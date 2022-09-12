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
      totalCases: ref(0),
      animated: false,
      slideRAnim(el: Element) {
        el.classList.remove('offLeft');
        el.classList.add('animate-slideRight');
      },
      slideLAnim(el: Element) {
        el.classList.remove('offRight');
        el.classList.add('animate-slideLeft');
      },
      slideFadeUAnim(el: Element) {
        el.classList.remove('seethroughOffBottom');
        el.classList.add('animate-fadeUp');
      },
      fadeAnim(el: Element) {
        el.classList.add('animate-fadeIn');
        el.classList.remove('seethrough');
      }
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
  .row.bg-black
    .col-12.col-md-6.q-pb-xl
      .landing-left.q-pa-lg.float-right.animate-fade
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
    .col-12.col-md-6.img-parent
      img.img2.animated.fadeInRight(src='~src/assets/diag_cuts.svg')
      .row.justify-center.feat-card
        .landing-right
          .landing-right-card-container
            .col-md-6.q-pa-lg(v-if='assets.length > 0')
              Cards(style='width: 25em', :data='assets[0]', type='Assets')

  //- Stats sections
  .row.q-py-md
  .row.justify-center.img-section
    .col-md-4.col-xs-12
      .row.justify-center.q-pb-sm
        .col
          .text-center(v-if='$q.screen.gt.sm')
            .stats-titles Currently Invested
            .stats-numbers &#163; {{ totalGBP }}
            .stats-line.center
          .text-center(v-else)
            .stats-titles Currently Invested
            .stats-numbers &#163; {{ totalGBP }}
            .stats-line.center
    .col-md-4.col-xs-12
      .row.justify-center.q-pb-sm
        .col
          .text-center(v-if='$q.screen.gt.sm')
            .stats-titles Backers
            .stats-numbers {{ totalBackers }}
            .stats-line.center
          .text-center(v-else)
            .stats-titles Backers
            .stats-numbers {{ totalBackers }}
            .stats-line.center
    .col-md-4.col-xs-12
      .row.justify-center.q-pb-md
        .col
          .text-center(v-if='$q.screen.gt.sm')
            .stats-titles.text-no-wrap Cases Funded
            .stats-numbers {{ totalCases }}
            .stats-line.center
          .text-center(v-else)
            .stats-titles.text-no-wrap Cases Funded
            .stats-numbers {{ totalCases }}
            .stats-line.center
  .row.q-pb-md

  //- Featured Collections
  .div.q-py-xl.bg-black.img-parent(style='z-index: -2')
    .div.seethrough(v-scroll-fire='fadeAnim')
      img.img1.seethroughOffBottom(
        src='~src/assets/bg_grey_diag.svg',
        v-scroll-fire='slideFadeUAnim',
        style='z-index: -1'
      )
    .row.justify-center
      h2.col.title-section.text-secondary.offLeft(v-scroll-fire='slideRAnim')
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
  .row.justify-center.q-pt-xl.bg-white
    h2.col.title-section.text-black.offLeft(v-scroll-fire='slideRAnim')
      span How to use &#32
      span.underline LegalCoin
  .row.justify-evenly.q-py-xl.bg-white.top.q-px-xl.items-center
    .col-4-lg.q-mx-md.seethrough(v-scroll-fire='fadeAnim')
      .row.justify-center.q-mb-md
        img.illustration(src='~src/assets/Fund.svg')
      .row.justify-center.illustration-title.text-center
        | Fund a lawsuit
      .illustration-body.text-center.q-mb-xl purchase a stake in a worthy cause
    .col-4-lg.q-mx-md.seethrough(v-scroll-fire='fadeAnim')
      .row.justify-center.q-mb-md
        img.illustration(src='~src/assets/Trade.svg')
      .row.justify-center.illustration-title.text-center
        | Trade while you wait
      .illustration-body.text-center.q-mb-xl buy and sell throughout the lawsuit
    .col-4-lg.q-mx-md.seethrough(v-scroll-fire='fadeAnim')
      .row.justify-center.q-mb-md
        img.illustration(src='~src/assets/Claim.svg')
      .row.justify-center.illustration-title.text-center
        | Get your money back
      .illustration-body.text-center.q-mb-xl claim your returns at the end

  //- Recommended for you
  .div.q-py-xl.bg-grey-4.img-parent(style='z-index: -2')
    .div.seethrough(v-scroll-fire='fadeAnim')
      img.img1.seethroughOffBottom(
        src='~src/assets/bg_grey_diag.svg',
        v-scroll-fire='slideFadeUAnim',
        style='z-index: -1'
      )
    .row.justify-center.seethrough(v-scroll-fire='fadeAnim')
      h2.col.title-section.text-black.offLeft(v-scroll-fire='slideRAnim')
        span Recommended &#32
        span.underline for you
    .row.justify-center.seethrough(v-scroll-fire='fadeAnim')
      .featured-card.q-py-sm.q-px-md(
        v-for='template in trendingTemplates.slice(0, numberOfCards)',
        v-if='trendingTemplates.length > 0'
      )
        Cards.rounded.shadow-10(:data='template', type='Templates')

  //- Illustrations
  .row.justify-center.q-py-xl.bg-white(style='z-index: 1')
    .illustration2-title.col.text-center.text-black.offLeft(
      v-scroll-fire='slideRAnim'
    )
      span Become a third-party funder for legal cases and reap reasonable rewards
  .row.justify-evenly.q-px-xl.q-pb-xl.bg-white.items-center
    .col-4-lg.seethrough(v-scroll-fire='fadeAnim')
      .row.justify-center.q-mb-md
        img.illustration2(src='~src/assets/ad_1.png')
      .row.justify-center.illustration-title.text-center
        | An online retail platform
      .row.justify-center
        .col-auto.illustration-body.text-center.q-mb-xl selling case-specific NFT's each managed by a smart contract
    .col-4-lg.seethrough(v-scroll-fire='fadeAnim')
      .row.justify-center.q-mb-md
        img.illustration2(src='~src/assets/ad_2.png')
      .row.justify-center.illustration-title.text-center
        | A secondary marketplace
      .row.justify-center
        .col-auto.illustration-body.text-center.q-mb-xl enables you to freely trade your NFTs prior to maturity
    .col-4-lg.seethrough(v-scroll-fire='fadeAnim')
      .row.justify-center.q-mb-md
        img.illustration2(src='~src/assets/ad_3.png')
      .row.justify-center.illustration-title.text-center
        | Cash in your NFT
      .row.justify-center
        .col-auto.illustration-body.text-center.q-mb-xl after the lawsuit and share in the rewards of the winnings
</template>

<style lang="sass" scoped>
.offLeft
  transform: translateX(-2000px)
.animate-slideRight
  animation: slideRight 0.5s forwards

@keyframes slideRight
  0%
    transform: translateX(-2000px)
  100%
    transform: translateX(0px)
.offRight
  transform: translateX(1500px)
.animate-slideLeft
  animation: slideLeft 1s forwards

@keyframes slideLeft
  0%
    transform: translateX(1500px)
  100%
    transform: translateX(0px)
.offBottom
  transform: translateY(200px)
.animate-slideUp
  animation: slideUp 3s forwards

@keyframes slideUp
  0%
    transform: translateY(200px)
  100%
    transform: translateY(0px)
.seethrough
  opacity: 0%
.animate-fadeIn
  animation: fadeIn 2s

@keyframes fadeIn
  0%
    opacity: 0%
  100%
    opacity: 100%
.seethroughOffBottom
  opacity: 0%
  transform: translateY(-100px)
.animate-fadeUp
  animation: fadeUp 2s

@keyframes fadeUp
  0%
    opacity: 0%
    transform: translateY(200px)
  100%
    opacity: 100%
    transform: translateY(0px)
.animate-fade
  animation: fade 2s

@keyframes fade
  0%
    opacity: 0%
  100%
    opacity: 100%
.stats-titles
  // font-size: calc(15px + (30 - 15) * ((100vw - 300px) / (1600 - 300)))
  font-size: 1rem
  color: #797979
.stats-numbers
  font-size: 3rem
  font-weight: 600
.center
  margin: auto
.stats-line
  height: 2px
  width: 5em
  background: black
.underline
  text-decoration: underline
  text-decoration-color: $primary
  text-underline-offset: 1rem
.title-section
  margin-left: 5%
.img-section
  margin-left: 5%
  margin-right: 5%
.top
  z-index: 5
.bg-feat
  position: relative
.bg-trend
  position: relative
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
.img2
  position: absolute
  bottom: 0
  right: 0
  max-width: 100%
  max-height: 100%
  background-size: cover
  z-index: 0
.illustration
  max-height: 20rem
  min-width: 150px
  aspect-ratio: 4/3
.illustration2-title
  font-size: 2.1rem
  font-family: 'ralewaybold'
.illustration2
  max-height: 20rem
  min-width: 150px
  max-width: 250px
.illustration-title
  font-family: "ralewaybold"
  font-size: 2rem
.illustration-body
  font-family: "ralewayregular"
  font-size: 1.5rem
  max-width: 25rem

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
    left: 0
    right: 0
    bottom: 0rem
    background-image: url("~src/assets/bg_img_diag4.svg")
    background-repeat: no-repeat
    background-size: cover
@media (max-width: $breakpoint-md-min)
  .landing-right
    margin-top: 10rem
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
    background-image: url("~src/assets/bg_img_diag4.svg")
    background-repeat: no-repeat
    background-size: cover
.featured-card
  width: 340px
  // width: 20em
  height: 100%
</style>
