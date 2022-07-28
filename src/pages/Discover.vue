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
    const price = computed(() => getQueryPrice());
    const status = computed(() => getQueryStatus());
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
q-card(square, flat)
  q-card-section.row.fit.bg-white.items-center.content-center.justify-center
    .col-2
      q-btn(icon='fas fa-arrow-left', round, flat, onclick='history.go(-1)')
    .col-8.text-body1.text-uppercase.text-center.self-center Discover
    .col-2
q-separator

.row.justify-center
  .col-12
    AtomicAssetsView(
      :ApiParams='assetOptions',
      :Page='page',
      :ItemsPerPage='limit',
      :DataParams='dataOptions',
      Type='Discover',
      :Price='price',
      :DisableSearch='false'
    )
</template>

<style scoped lang="sass">
.info-block
    width: 100%
    max-width: 6rem
</style>
