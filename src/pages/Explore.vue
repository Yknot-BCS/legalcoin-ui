<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'src/store';
import {
  atomic_api,
  getQueryDataOptions,
  getQueryApiOptions,
  getQueryPage,
  getQueryLimit
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
    const assetOptions = computed(() => {
      return {
        owner: process.env.AA_ACCOUNT,
        search: search.value,
        min_template_mint: '1',
        max_template_mint: '7000',
        ...getQueryApiOptions(route.query)
      } as unknown;
    });
    // - Gallery view

    onMounted(() => console.log(''));
    return {
      assetOptions,
      page,
      dataOptions,
      limit,
      search,
      showFilter
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
        Type='Templates'
      )
</template>

<style scoped lang="sass">
.info-block
    width: 100%
    max-width: 6rem
</style>
