<script lang="ts">
import {
  ICollection,
  ITemplate
} from 'atomicassets/build/API/Explorer/Objects';
import { defineComponent, ref, computed } from 'vue';
import {
  atomic_api,
  getSalesQueryApiOptions,
  getQueryPage,
  getQueryLimit,
  getQueryStatus
} from 'src/api/atomic_assets';
import { useRoute } from 'vue-router';
import AtomicAssetsView from 'src/components/atomicAssets/AtomicAssetView.vue';
import { copyToClipboard } from 'quasar';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default defineComponent({
  name: 'Collection',
  components: { AtomicAssetsView },
  setup() {
    const route = useRoute();
    const collectionData = ref<ICollection>(
      new Object({ data: { img: '' } }) as ICollection
    );
    const templatesData = ref<ITemplate[]>();

    // - Gallery view
    const page = computed(() => getQueryPage(route.query));
    const limit = computed(() => getQueryLimit(route.query));
    const status = computed(() => getQueryStatus());
    const assetOptions = computed(() => {
      return {
        state: '1',
        collection_whitelist: route.params.collection as string,
        ...getSalesQueryApiOptions(route.query, status.value)
      } as unknown;
    });

    return {
      templatesData,
      collectionData,
      assetOptions,
      page,
      limit
    };
  },
  computed: {
    collectionImg(): string {
      return `${process.env.IPFS_ENDPOINT}/ipfs/${<string>(
        this.collectionData.data.img
      )}`;
    },
    shareURL(): string {
      return window.location.origin + this.$route.path;
    }
  },
  methods: {
    clipboardURL() {
      void copyToClipboard(window.location.origin + this.$route.path).then(
        () => {
          this.$q.notify({
            color: 'positive',
            message: 'Copied URL to clipboard'
          });
        }
      );
    },
    isLegalCoin(authorized_accounts: string) {
      // Check if the asset is from legalcoin
      if (authorized_accounts === process.env.AA_ACCOUNT) {
        return true;
      } else {
        return false;
      }
    },
    async getCollectionData() {
      this.collectionData = await atomic_api.getCollection(
        this.$route.params.collection as string
      );
    }
  },
  async mounted() {
    console.log('Collection mounted');

    // check if asset of template
    if (this.$route.params.collection) {
      console.log('Is Collection');
      await this.getCollectionData();
    }
  }
});
</script>

<template lang="pug">
q-page
  //- Background image
  .row(style='height: 11rem')
    q-img.bg-img(
      src='~assets/collections/slanted-gradient.svg',
      height='20rem'
    )
  //- Collection image
  .row.q-px-lg.items-center.justify-between(style='height: 12rem')
    .col.q-pt-xl
      q-card.row.items-center.asset-img
        q-card-section.col
          q-img(:src='collectionImg')
    //- Collection name and description //- Todo: smallest mobile view, links overlap title
  .row 
    .col.q-pl-lg
      .row.text-h3
        | {{ collectionData.data.name }}
    //- Links
    .col.self-center.text-right.q-gutter-lg.q-pr-lg
      q-btn.text-body2(icon='share', round, size='md')
        q-menu(:offset='[150, 10]')
          q-list
            q-item(
              clickable,
              v-close-popup,
              :href='`http://twitter.com/intent/tweet?text=Check%20out%20this%20collection%20on%20LegalCoin:&url=${shareURL}`',
              target='_blank'
            )
              q-item-section
                .row.items-center
                  .col-shrink.q-pr-sm
                    q-icon(name='fab fa-twitter', size='2rem', color='blue')
                  .col.text-bold Share to Twitter
            q-separator
            //- Facebook link doesn't work with locally hosted app, but if provided with valid web URL will work
            q-item(
              clickable,
              v-close-popup,
              :href='`https://www.facebook.com/sharer/sharer.php?u=${shareURL}`',
              target='_blank'
            )
              q-item-section
                .row.items-center
                  .col-shrink.q-pr-sm
                    q-icon(
                      name='fab fa-facebook',
                      size='2rem',
                      style='color: #4267b2'
                    )
                  .col.text-bold Share to Facebook
            q-separator
            q-item(clickable, v-close-popup, @click='clipboardURL')
              q-item-section
                .row.items-center
                  .col-shrink.q-pr-sm
                    q-icon(name='fa fa-clipboard', size='2rem')
                  .col.text-bold Copy link

  .row.text-subtitle1.q-px-xs.q-py-sm.q-pl-lg
    .col.text-bold
      | {{ collectionData.data.description }}
    //- Info
  .row.q-pl-lg
    .col Creator: {{ collectionData.authorized_accounts?.[0] }}
    .col Market Fee: {{ collectionData.market_fee * 100 }}%
    .col Created: {{ new Date(Number(collectionData.created_at_time)).toLocaleDateString() }}
  //- Assets
  .row.justify-center
    .col-12
      q-card(flat)
        AtomicAssetsView(
          :ApiParams='assetOptions',
          :Page='page',
          :ItemsPerPage='limit',
          :DataParams='[]',
          Type='Discover',
          :FilterCollection='false'
        )
</template>

<style lang="sass" scoped>
.asset-img
  position: relative
  bottom: 5rem
  min-height: 200px
  max-height: 200px
  min-width: 200px
  max-width: 200px
.bg-img
  z-index: -1
</style>
