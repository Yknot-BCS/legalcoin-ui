<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  onMounted,
  PropType,
  toRefs,
  watch
} from 'vue';
import { GalleryCard } from 'src/types';
import GalleryView from 'src/components/gallery/GalleryView.vue';
import { useQuasar } from 'quasar';
import {
  get_assets,
  get_collections,
  get_templates,
  get_discover,
  getCollectionsList,
  get_profile
} from 'src/api/atomic_assets';
import { AssetsApiParams } from 'atomicassets/build/API/Explorer/Params';
import { useRouter, useRoute } from 'vue-router';
import AssetFilter from 'src/components/atomicAssets/AssetFilter.vue';

export default defineComponent({
  name: 'AtomicAssetView',
  components: { GalleryView, AssetFilter },
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
    },
    Type: {
      type: String,
      required: true
    },
    Price: {
      type: Object as PropType<{ min: number; max: number }>,
      required: false
    },
    DisableSearch: {
      type: Boolean,
      required: false,
      default: true
    },
    DisableFilter: {
      type: Boolean,
      required: false,
      default: true
    },
    FilterStatus: {
      type: Boolean,
      required: false,
      default: true
    },
    FilterPrice: {
      type: Boolean,
      required: false,
      default: true
    },
    FilterMarket: {
      type: Boolean,
      required: false,
      default: true
    },
    FilterCollection: {
      type: Boolean,
      required: false,
      default: true
    },
    Tier: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  setup(props) {
    const router = useRouter();
    const route = useRoute();
    const $q = useQuasar();
    const GalleryData = ref<GalleryCard[]>([]);
    const disableFilter = computed(() => props.DisableFilter);
    const showFilter = ref<boolean>($q.screen.gt.sm);
    const showFilterDialog = ref<boolean>(false);
    const DataParams = computed(() => props.DataParams);
    const ApiParams = computed(() => props.ApiParams);
    const market = computed(
      () => (route.query['market'] as string) || 'legalcoin'
    );
    const status = computed(() =>
      market.value === 'open'
        ? (route.query['status'] as string) || 'buynow'
        : 'buynow'
    );
    const { Page, ItemsPerPage, Type } = toRefs(props);
    const price =
      ref(props.Price) ||
      ref<{ min: number; max: number }>({ min: 0, max: 10000 });
    const page = ref(Page);
    const search =
      ref<string>((ApiParams.value as AssetsApiParams).search as string) ||
      ref('');
    const pageOptions = [6, 12, 24, 48];
    const limit = ref(ItemsPerPage);
    const assetCount = ref<number>(1);
    const sortOptions = ref([
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
    const sort = ref(
      sortOptions.value.find(
        (v) =>
          v.sort === (ApiParams.value as AssetsApiParams).sort &&
          v.order === (ApiParams.value as AssetsApiParams).order
      )
    );
    const Pages = computed((): number =>
      Math.ceil(assetCount.value / limit.value)
    );
    const disableSearch = computed(() => props.DisableSearch);
    const filterStatus = computed(() => props.FilterStatus);
    const filterPrice = computed(() => props.FilterPrice);
    const filterMarket = computed(() => props.FilterMarket);
    const filterCollection = computed(() => props.FilterCollection);
    const filterTier = computed(() => props.Tier);
    const collections = ref(
      (ApiParams.value as AssetsApiParams).collection_whitelist?.split(',') ||
        ([] as string[])
    );
    const collectionsArray = ref<string[]>([]);
    // Function to open correct filter on mobile or desktop
    function Filter() {
      if ($q.screen.lt.md) {
        showFilterDialog.value = !showFilterDialog.value;
      } else {
        showFilter.value = !showFilter.value;
      }
    }
    // Check the type of atomic asset and then make api request to get gallery data
    async function getData() {
      let response: {
        data: GalleryCard[];
        count: number;
      };
      switch (Type.value) {
        case 'Assets':
          response = await get_assets(
            ApiParams.value,
            Page.value,
            ItemsPerPage.value,
            DataParams.value
          );

          GalleryData.value = response.data;
          assetCount.value = response.count;

          break;
        case 'Collections':
          response = await get_collections(
            ApiParams.value,
            Page.value,
            ItemsPerPage.value
          );

          GalleryData.value = response.data;
          assetCount.value = response.count;

          break;
        case 'Templates':
          response = await get_templates(
            ApiParams.value,
            Page.value,
            ItemsPerPage.value,
            DataParams.value
          );

          GalleryData.value = response.data;
          assetCount.value = response.count;

          break;

        case 'Discover':
          response = await get_discover(
            ApiParams.value,
            Page.value,
            ItemsPerPage.value,
            DataParams.value,
            status.value,
            market.value
          );

          GalleryData.value = response.data;
          assetCount.value = response.count;

          break;
        case 'Profile':
          response = await get_profile(
            ApiParams.value,
            Page.value,
            ItemsPerPage.value,
            DataParams.value,
            status.value
          );
          GalleryData.value = response.data;
          assetCount.value = response.count;

          break;
        default:
          DataParams.value;
          response = await get_assets(
            ApiParams.value,
            Page.value,
            ItemsPerPage.value,
            DataParams.value
          );

          GalleryData.value = response.data;
          assetCount.value = response.count;

          break;
      }
    }
    // Apply page filter to url query
    function updatePage(val: number) {
      applyFilter('page', val.toString());
    }
    // Apply limit filter to url query
    function updateLimit(val: number) {
      applyFilter('limit', val.toString());
    }
    // Apply filters to url query
    function applyFilter(key: string, value: string) {
      let query = { ...route.query };
      query[key] = value;
      void router.push({
        path: router.currentRoute.value.path,
        query: query
      });
    }
    // if any change is detected in these values update gallery data
    watch([DataParams, ApiParams, Page, ItemsPerPage], () => {
      void getData();
    });

    watch(ApiParams, (newval) => {
      collections.value = (
        newval as AssetsApiParams
      ).collection_whitelist?.split(',');
    });

    // When component mounts get gallery data
    onMounted(() => {
      void getCollectionsList().then((collectionData) => {
        collectionsArray.value = collectionData.array;
      });
      void getData();
    });

    return {
      GalleryData,
      pageOptions,
      page,
      Pages,
      limit,
      sort,
      sortOptions,
      showFilterDialog,
      getData,
      Filter,
      applyFilter,
      updateLimit,
      updatePage,
      search,
      showFilter,
      price,
      nftCount: ref(0),
      projectCount: ref(0),
      status,
      filterStatus,
      disableFilter,
      filterPrice,
      filterCollection,
      filterTier,
      type: Type,
      collections,
      collectionsArray,
      model: ref('one'),
      market,
      disableSearch,
      filterMarket
    };
  }
});
</script>

<template lang="pug">
.row.justify-center
  .col-12
    q-card(flat)
      // top action section for gallery (filter/search/sort)
      q-card-section
        .row.justify-between.q-col-gutter-md
          .col-md-1.col-sm-6.col-xs-6(v-if='disableFilter')
            .filter-container.full-width(
              text-color='black',
              :class='$q.screen.lt.md ? "" : "no-border"',
              :label='$q.screen.lt.md ? "Filters" : ""'
            )
              q-btn.full-width.btn--no-hover(
                color='grey-5',
                flat,
                size='15px',
                icon='filter_list',
                @click='Filter',
                text-color='black',
                :label='$q.screen.lt.md ? "Filters" : ""'
              )
          .col-md-8.col-sm-12.col-xs-12(
            :class='$q.screen.lt.md ? "order-last" : ""',
            v-if='disableSearch'
          )
            q-input(
              dense,
              outlined,
              v-model='search',
              placeholder='Search',
              @update:model-value='(val) => { applyFilter("search", val.toString()); }'
            )
              template(v-slot:prepend)
                q-icon(v-if='search === ""', name='search')
                q-icon.cursor-pointer(
                  v-else,
                  name='clear',
                  @click='() => { search = ""; applyFilter("search", ""); }'
                )
          .col-md-3.col-sm-6.col-xs-6
            q-select.filters-selection(
              outlined,
              dense,
              v-model='sort',
              :options='sortOptions',
              @update:model-value='(val) => { applyFilter("sort", val.sort); applyFilter("order", val.order); }',
              color='primary'
            )
      // Filter for desktop view
      q-card-section
        .row.justify-evenly
          .col-lg-2.col-md-3.q-pr-md(v-if='showFilter && $q.screen.gt.sm')
            q-card.q-pb-md(bordered, flat)
              AssetFilter(
                :Status='filterStatus',
                :Market='filterMarket',
                :Collection='filterCollection',
                :Tier='filterTier',
                :Price='filterPrice'
              )

          // Gallery section
          div(:class='showFilter ? "col-lg-10 col-md-9" : "col-12"')
            GalleryView(:data='GalleryData', :type='type')

          // Paging for Gallery section
          .col-12.q-mt-md
            .row.justify-center
              q-select.q-px-sm(
                dense,
                outlined,
                v-model.number='limit',
                type='number',
                :options='pageOptions',
                style='max-width: 100px',
                @update:model-value='(v) => { updateLimit(v); }'
              )
              q-pagination(
                v-model='page',
                :max='Pages',
                input,
                @update:model-value='(v) => { updatePage(Number(v)); }'
              )
    // Filter dialog for mobile view
    q-dialog(v-model='showFilterDialog', maximized, no-route-dismiss)
      .row.full-height.full-width.filter-dialog
        .col-12
          q-card.q-pa-md(flat)
            q-btn.absolute-top-right.q-pb-lg(
              size='20px',
              flat,
              dense,
              round,
              icon='clear',
              v-close-popup,
              style='z-index: 1'
            )
            .q-pa-md
              AssetFilter(
                :Status='filterStatus',
                :Market='filterMarket',
                :Collection='filterCollection',
                :Tier='filterTier',
                :Price='filterPrice'
              )
</template>

<style scoped lang="sass">
.filter-dialog
  background-color: white
.filter-view
  max-width: 400px

.filter-container
  border: 1px solid $grey-5
  border-radius: 5px
  height: 40px

.filter-container:hover
  border: 1px solid black

:deep(.q-btn.btn--no-hover .q-focus-helper)
  display: none
</style>
