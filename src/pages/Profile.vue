<script lang="ts">
import { defineComponent, computed, ref, onMounted, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'src/store';
import {
  atomic_api,
  getQueryDataOptions,
  getQueryApiOptions,
  getQueryPage,
  getQueryLimit,
  getCollectionsList,
  getQueryStatus,
  getSalesQueryApiOptions
} from 'src/api/atomic_assets';
import GalleryView from 'src/components/gallery/GalleryView.vue';
import AtomicAssetsView from 'src/components/atomicAssets/AtomicAssetView.vue';

export default defineComponent({
  name: 'Profile',
  components: { GalleryView, AtomicAssetsView },
  setup() {
    const store = useStore();
    const route = useRoute();
    const showFilter = ref<boolean>(false);
    const search = ref<string>('');
    const profileId = computed(() => route.params.profile);
    const profile = computed(() => store.state.account.profile);

    // - Gallery view
    const dataOptions = computed(() => getQueryDataOptions(route.query));
    const page = computed(() => getQueryPage(route.query));
    const limit = computed(() => getQueryLimit(route.query));
    const status = computed(() => getQueryStatus(route.query));
    const assetCount = ref<number>(1);
    const collectionCount = ref<number>(1);
    const collections = ref<string>('emissions.lc');
    const myGalleryOptions = computed(() => {
      if (status.value == 'buynow') {
        return {
          owner: profileId.value,
          search: search.value,
          collection_whitelist: collections.value,
          ...getQueryApiOptions(route.query)
        } as unknown;
      } else {
        return {
          seller: profileId.value,
          search: search.value,
          collection_whitelist: collections.value,
          ...getSalesQueryApiOptions(route.query, status.value)
        } as unknown;
      }
    });
    // - Gallery view

    const isMyAccount = computed(
      () => profileId.value === profile.value.accountName
    );

    onMounted(async () => {
      let data = await atomic_api.getAccount(profileId.value as string);
      assetCount.value = Number(data.assets);
      collectionCount.value = data.collections.length;
    });
    onBeforeMount(async () => {
      const collectionData = await getCollectionsList();
      collections.value = collectionData.stringList;
    });
    return {
      profileId,
      profile,
      myGalleryOptions,
      page,
      dataOptions,
      isMyAccount,
      limit,
      search,
      showFilter,
      assetCount,
      collectionCount
    };
  }
});
</script>

<template lang="pug">
.row.justify-center
  .col-12
    q-card(flat)
      q-card-section.row.fit.bg-white.items-center.content-center.justify-center(
        v-if='isMyAccount'
      )
        .text-bold
          | YOUR PROFILE
      q-separator.q-mx-md
      q-card-section.bg-white
        //- Avatar and name
      q-card-section.fit.column.wrap.justify-center.items-center.content-center
        q-avatar(size='6rem')
          img(src='~/assets/Account_Icon.svg')
        .col.q-mt-sm
          .col.text-subtitle1.text-bold
            | {{ isMyAccount ? profile.name + ' ' + profile.surname : profileId }}
      q-card-section.row.justify-center.content-center.items-center
        .column.justify-center.content-center.items-center.info-block
          .col.text-subtitle1
            | {{ assetCount }}
          .col.text-subtitle1
            | NFTS
        q-separator.q-mx-md(vertical, color='black')
        .column.justify-center.content-center.items-center.info-block
          .col.text-subtitle1
            | {{ collectionCount }}
          .col.text-subtitle1
            | PROJECTS
      AtomicAssetsView(
        :ApiParams='myGalleryOptions',
        :Page='page',
        :ItemsPerPage='limit',
        :DataParams='dataOptions',
        Type='Profile',
        :FilterPrice='false',
        :FilterMarket='false'
      )
</template>

<style scoped lang="sass">
.info-block
    width: 100%
    max-width: 6rem
</style>
