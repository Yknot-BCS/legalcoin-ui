<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'src/store';
import { atomic_api } from 'src/api/atomic_assets';
import { GalleryCard } from 'src/types';
import GalleryView from 'src/components/gallery/GalleryView.vue';
import AtomicAssetsView from 'src/components/atomicAssets/AtomicAssetView.vue';

export default defineComponent({
  name: 'Profile',
  components: { GalleryView, AtomicAssetsView },
  setup() {
    const store = useStore();
    const route = useRoute();
    const myGalleryData = ref<GalleryCard[]>([]);
    const showFilter = ref<boolean>(false);
    const search = ref<string>('');
    const tier = ref<{ label: string; value: string }>({
      label: 'All',
      value: 'all'
    });
    const tierOptions = ref([
      { label: 'Diamond', value: 'Diamond' },
      { label: 'Gold', value: 'Gold' },
      { label: 'Silver', value: 'upload' },
      { label: 'Bronze', value: 'friend' },
      { label: 'All', value: 'all' }
    ]);
    const sort = ref({
      label: 'Created (Newest)',
      value: 'created-desc',
      sort: 'created',
      order: 'desc'
    });
    const page = ref<number>(1);
    const pageOptions = [6, 12, 24, 48];
    const limit = ref<number>(6);
    const assetCount = ref<number>(1);
    const profileId = computed(() => route.params.profile);
    const profile = computed(() => store.state.account.profile);
    const sortOptions = computed(() => [
      {
        label: 'Alphabetical A-Z',
        value: 'alphabetical-asc',
        sort: 'name',
        order: 'asc',
        category: '1'
      },
      {
        label: 'Alphabetical Z-A',
        value: 'alphabetical-desc',
        sort: 'name',
        order: 'desc'
      },
      {
        label: 'Created (Newest)',
        value: 'created-desc',
        sort: 'created',
        order: 'desc'
      },
      {
        label: 'Created (Oldest)',
        value: 'created-asc',
        sort: 'created',
        order: 'asc'
      },
      {
        label: 'Mint (Highest)',
        value: 'template_mint-asc',
        sort: 'template_mint',
        order: 'asc'
      },
      {
        label: 'Mint (Lowest)',
        value: 'template_mint-desc',
        sort: 'template_mint',
        order: 'desc'
      }
    ]);
    const assetPages = computed((): number =>
      Math.ceil(assetCount.value / limit.value)
    );
    const isMyAccount = computed(
      () => profileId.value === profile.value.cryptoAccount.accountName
    );
    function assetToAmount(asset: string, decimals = -1): number {
      try {
        let qty: string = asset.split(' ')[0];
        const val: number = parseFloat(qty);
        if (decimals > -1) qty = val.toFixed(decimals);
        return val;
      } catch (error) {
        return 0;
      }
    }
    function getYield(cost: string, profit: string): string {
      try {
        const val =
          ((assetToAmount(profit) - assetToAmount(cost)) /
            assetToAmount(cost)) *
          100;
        return val.toFixed(0).toString() + '%';
      } catch (error) {
        return '0%';
      }
    }
    const myGalleryOptions = {
      owner: profileId.value,
      order: sort.value.order,
      sort: sort.value.sort,
      search: search.value,
      min_template_mint: '1',
      max_template_mint: '7000'
    };
    async function getData() {
      const datOptions: any[] = [];
      assetCount.value = await atomic_api.countAssets(
        myGalleryOptions as any,
        datOptions
      );
      let data = await atomic_api.getAssets(
        myGalleryOptions as any,
        page.value,
        limit.value,
        datOptions
      );
      myGalleryData.value = data.map((asset) => {
        return {
          ...asset.data,
          to: '/asset/' + asset.asset_id,
          yield: getYield(asset.data.mintprice, asset.data.maturedvalue),
          name: asset.data.name as string,
          imageUrl:
            asset.data.img && (asset.data.img as string).includes('http')
              ? (asset.data.img as string)
              : 'https://ipfs.io/ipfs/' + (asset.data.img as string),
          collection: asset.collection.collection_name,
          template: asset.template.template_id,
          schema: asset.schema.schema_name,
          id: asset.asset_id
        } as GalleryCard;
      });
      console.log(myGalleryData.value);
    }
    onMounted(async () => {
      void (await getData());
    });

    return {
      profileId,
      profile,
      myGalleryData,
      myGalleryOptions,
      pageOptions,
      page,
      assetPages,
      isMyAccount,
      limit,
      sort,
      sortOptions,
      getData,
      search,
      tier,
      tierOptions,
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
        :DataParams='[]'
      )
</template>

<style scoped lang="sass">
.info-block
    width: 100%
    max-width: 6rem
.profile-card
    width: 100%
    max-width: 30rem
</style>
