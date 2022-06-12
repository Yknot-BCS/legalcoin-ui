<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  onMounted,
  PropType,
  toRefs
} from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'src/store';
import { atomic_api } from 'src/api/atomic_assets';
import { GalleryCard } from 'src/types';
import GalleryView from 'src/components/gallery/GalleryView.vue';

export default defineComponent({
  name: 'AtomicAssetView',
  components: { GalleryView },
  props: {
    ApiParams: {
      type: Object as PropType<unknown>,
      required: true
    },
    Page: {
      type: Number,
      required: true
    },
    ItemsPerPage: {
      type: Number,
      required: true
    },
    DataParams: {
      type: Object as PropType<{ key: string; value: string }[]>,
      required: true
    }
  },
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const myGalleryData = ref<GalleryCard[]>([]);
    const showFilter = ref<boolean>(false);
    const search = ref<string>('');
    const { ApiParams, Page, ItemsPerPage, DataParams } = toRefs(props);
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
    async function getData() {
      assetCount.value = await atomic_api.countAssets(
        ApiParams.value,
        DataParams.value
      );
      let data = await atomic_api.getAssets(
        ApiParams.value,
        Page.value,
        ItemsPerPage.value,
        DataParams.value
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
      q-card-section
        .row.justify-between.q-col-gutter-md
          .col-1
            q-btn(flat, icon='filter_list', @click='showFilter = !showFilter')
          .col-9
            q-input(
              dense,
              outlined,
              v-model='search',
              placeholder='Search',
              @update:model-value='() => { getData(); }'
            )
              template(v-slot:prepend)
                q-icon(v-if='search === ""', name='search')
                q-icon.cursor-pointer(
                  v-else,
                  name='clear',
                  @click='search = ""'
                )
          .col-2
            q-select.filters-selection(
              outlined,
              dense,
              v-model='sort',
              :options='sortOptions',
              @update:model-value='() => { getData(); }',
              color='primary'
            )
      q-card-section
        .row
          .col-12(v-if='showFilter')
            q-card.q-pa-md(bordered, flat)
              q-card-section
                .text-h5 Filters
              q-separator(inset)
              q-card-section
                .row
                  .col-6
                    .text-h6 Tier
                    q-option-group(
                      :options='tierOptions',
                      type='radio',
                      v-model='tier'
                    )

          .col-12
            GalleryView(:data='myGalleryData', type='asset')
          .col-12 
            .row.justify-center
              q-select.q-px-sm(
                dense,
                outlined,
                v-model.number='limit',
                type='number',
                :options='pageOptions',
                style='max-width: 100px',
                @update:model-value='() => { getData(); }'
              )
              q-pagination(
                v-model='page',
                :max='assetPages',
                input,
                @update:model-value='() => { getData(); }'
              )
</template>

<style scoped lang="sass"></style>
