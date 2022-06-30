<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'src/store';
import {
  atomic_api,
  getQueryDataOptions,
  getSalesQueryApiOptions,
  getQueryPage,
  getQueryLimit,
  getQueryStatus,
  getQueryPrice,
  getCollectionsList
} from 'src/api/atomic_assets';
import GalleryView from 'src/components/gallery/GalleryView.vue';
import AtomicAssetsView from 'src/components/atomicAssets/AtomicAssetView.vue';

export default defineComponent({
  name: 'Explore',
  components: { GalleryView, AtomicAssetsView },
  setup() {
    const store = useStore();
    const route = useRoute();
    const showFilter = ref<boolean>(false);
    const search = ref<string>('');

    // - Gallery view
    const dataOptions = computed(() => getQueryDataOptions(route.query));
    const page = computed(() => getQueryPage(route.query));
    const limit = computed(() => getQueryLimit(route.query));
    const status = computed(() => getQueryStatus(route.query));
    const price = computed(() => getQueryPrice(route.query));
    const collections = ref<string>('');
    console.log(status.value);
    const assetOptions = computed(() => {
      return {
        state: '1',
        search: search.value,
        collection_whitelist: collections.value,
        ...getSalesQueryApiOptions(route.query)
      } as unknown;
    });
    console.log(getSalesQueryApiOptions(route.query));
    // - Gallery view

    onMounted(async () => {
      const collectionData = await getCollectionsList();
      collections.value = collectionData.stringList;
      console.log(collections.value);
    });
    return {
      assetOptions,
      page,
      dataOptions,
      limit,
      search,
      showFilter,
      status,
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
    q-card(bordered)
      AtomicAssetsView(
        :ApiParams='assetOptions',
        :Page='page',
        :ItemsPerPage='limit',
        :DataParams='dataOptions',
        Type='Sale',
        :Status='status',
        :Price='price'
      )
</template>

<style scoped lang="sass">
.info-block
    width: 100%
    max-width: 6rem
</style>
