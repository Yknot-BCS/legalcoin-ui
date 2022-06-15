<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'src/store';
import {
  getQueryDataOptions,
  getQueryApiOptions,
  getQueryPage,
  getQueryLimit
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
    const myGalleryOptions = computed(() => {
      return {
        owner: profileId.value,
        search: search.value,
        min_template_mint: '1',
        max_template_mint: '7000',
        ...getQueryApiOptions(route.query)
      } as unknown;
    });
    // - Gallery view

    const isMyAccount = computed(
      () => profileId.value === profile.value.cryptoAccount.accountName
    );
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
      nftCount: ref(0),
      projectCount: ref(0)
    };
  }
});
</script>

<template lang="pug">
page
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
            | {{ nftCount }}
          .col.text-subtitle1
            | NFTS
        q-separator.q-mx-md(vertical, color='black')
        .column.justify-center.content-center.items-center.info-block
          .col.text-subtitle1
            | {{ projectCount }}
          .col.text-subtitle1
            | PROJECTS
      AtomicAssetsView(
        :ApiParams='myGalleryOptions',
        :Page='page',
        :ItemsPerPage='limit',
        :DataParams='dataOptions',
        Type='Aseets'
      )
</template>

<style scoped lang="sass">
.info-block
    width: 100%
    max-width: 6rem
</style>
