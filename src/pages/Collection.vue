<script lang="ts">
import {
  ICollection,
  ITemplate
} from 'atomicassets/build/API/Explorer/Objects';
import { defineComponent, ref, computed } from 'vue';
import {
  atomic_api,
  getQueryApiOptions,
  getQueryPage,
  getQueryLimit
} from 'src/api/atomic_assets';
import { useRoute } from 'vue-router';
import AtomicAssetsView from 'src/components/atomicAssets/AtomicAssetView.vue';

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
    const templateOptions = computed(() => {
      return {
        owner: process.env.AA_ACCOUNT,
        collection_name: route.params.collection as string,
        ...getQueryApiOptions(route.query)
      } as unknown;
    });
    // - Gallery view

    return {
      templatesData,
      collectionData,
      templateOptions,
      page,
      limit
    };
  },
  computed: {
    collectionImg(): string {
      return `https://ipfs.io/ipfs/${<string>this.collectionData.data.img}`;
    }
  },
  methods: {
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
  //- Collection Card
  //- Background image
  .row
    q-img.bg-img(src='~assets/collections/slanted-gradient.svg', height='20em')

  //- Collection image 
  .row.q-px-lg
    .col-3
      q-card.asset-img
        q-img(:src='collectionImg')

  //- Collection name and links
  .row.justify-between.content-center.items-center.q-pa-lg 
    .text-h2 
      | {{ collectionData.data.name }}
    .row.q-gutter-lg
      q-btn(
        round,
        icon='fa-solid fa-globe',
        :href='collectionData.data?.url',
        target='_blank'
      )
      q-btn(round, icon='fa-solid fa-ellipsis')

  //- Collection description
  .row.justify-start.q-pa-lg 
    .text-subtitle1 
      | {{ collectionData.data.description }}

  //- Collection info
  .column.justify-start.q-pa-lg
    .col Creator: {{ collectionData.authorized_accounts[0] }}
    .col Market Fee: {{ collectionData.market_fee * 100 }}%
    .col Created: {{ new Date(Number(collectionData.created_at_time)).toLocaleDateString() }}

  .row.justify-center
    .col-12
      q-card(flat)
        AtomicAssetsView(
          :ApiParams='templateOptions',
          :Page='page',
          :ItemsPerPage='limit',
          :DataParams='[]',
          Type='Templates'
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
