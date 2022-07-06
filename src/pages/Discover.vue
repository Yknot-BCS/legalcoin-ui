<script lang="ts">
import { defineComponent, computed, ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import {
  getQueryDataOptions,
  getSalesQueryApiOptions,
  getQueryPage,
  getQueryLimit,
  getQueryPrice,
  getCollectionsList,
  getQueryStatus
} from 'src/api/atomic_assets';
import GalleryView from 'src/components/gallery/GalleryView.vue';
import AtomicAssetsView from 'src/components/atomicAssets/AtomicAssetView.vue';

export default defineComponent({
  name: 'Explore',
  components: { GalleryView, AtomicAssetsView },
  setup() {
    const route = useRoute();
    const showFilter = ref<boolean>(false);
    const search = ref<string>('');

    // - Gallery view
    const dataOptions = computed(() => getQueryDataOptions(route.query));
    const page = computed(() => getQueryPage(route.query));
    const limit = computed(() => getQueryLimit(route.query));
    const price = computed(() => getQueryPrice(route.query));
    const status = computed(() => getQueryStatus(route.query));
    const collections = ref<string>('emissions.lc');
    const assetOptions = computed(() => {
      return {
        state: '1',
        search: search.value,
        collection_whitelist: collections.value,
        ...getSalesQueryApiOptions(route.query, status.value)
      } as unknown;
    });

    onBeforeMount(async () => {
      const collectionData = await getCollectionsList();
      collections.value = collectionData.stringList;
    });
    return {
      assetOptions,
      page,
      dataOptions,
      limit,
      search,
      showFilter,
      price,
      collections
    };
  }
});
</script>

<template lang="pug">
page
.row.justify-center
  .col-12
    q-card(flat)
      AtomicAssetsView(
        :ApiParams='assetOptions',
        :Page='page',
        :ItemsPerPage='limit',
        :DataParams='dataOptions',
        Type='Sale',
        :Price='price',
        :DisableSearch='false'
      )
</template>

<style scoped lang="sass">
.info-block
    width: 100%
    max-width: 6rem
</style>
