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
  get_sale,
  getCollectionsList,
  getQueryMarket,
  getQueryStatus
} from 'src/api/atomic_assets';
import { AssetsApiParams } from 'atomicassets/build/API/Explorer/Params';
import { useRouter, useRoute } from 'vue-router';

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
    },
    Type: {
      type: String,
      required: true
    },
    Price: {
      type: Object as PropType<{ min: number; max: number }>,
      required: false
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
    const showFilter = ref<boolean>(false);
    const showFilterDialog = ref<boolean>(false);
    const DataParams = computed(() => props.DataParams);
    const ApiParams = computed(() => props.ApiParams);
    const market = ref(getQueryMarket(route.query));
    const status = ref<string>(
      market.value === 'retail'
        ? getQueryStatus(route.query).toString()
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
    const tier = ref<string>(
      DataParams.value.find((v) => v.key === 'tier')
        ? DataParams.value.find((v) => v.key === 'tier').value
        : 'All'
    );
    const tierOptions = ref([
      { label: 'Diamond', value: 'Diamond' },
      { label: 'Gold', value: 'Gold' },
      { label: 'Silver', value: 'Silver' },
      { label: 'Bronze', value: 'Bronze' },
      { label: 'All', value: 'All' }
    ]);
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
    const filterStatus = computed(() => props.FilterStatus);
    const filterPrice = computed(() => props.FilterPrice);
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

        case 'Sale':
          response = await get_sale(
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
    async function updatePage(val: number) {
      await router.push({
        path: router.currentRoute.value.path,
        query: {
          search: search.value,
          'filter[tier]': tier.value,
          sort: sort.value.sort,
          page: val,
          limit: ItemsPerPage.value,
          order: sort.value.order
        }
      });
    }
    // Apply limit filter to url query
    async function updateLimit(val: number) {
      await router.push({
        path: router.currentRoute.value.path,
        query: {
          search: search.value,
          'filter[tier]': tier.value,
          sort: sort.value.sort,
          page: 1,
          limit: val,
          order: sort.value.order
        }
      });
    }
    // Apply tier filter to url query
    async function updateTier(val: string) {
      await router.push({
        path: router.currentRoute.value.path,
        query: {
          search: search.value,
          'filter[tier]': val,
          sort: sort.value.sort,
          page: 1,
          limit: limit.value,
          order: sort.value.order,
          market: JSON.stringify(market.value)
        }
      });
    }
    // Apply filters to url query
    function applyFilters() {
      if (Type.value === 'Sale') {
        void router.push({
          path: router.currentRoute.value.path,
          query: {
            search: search.value,
            'filter[tier]': tier.value,
            sort: sort.value.sort,
            order: sort.value.order,
            page: 1,
            limit: ItemsPerPage.value,
            market: market.value,
            status: status.value,
            min_price: price.value.min,
            max_price: price.value.max,
            collections:
              collections.value.length > 0
                ? collections.value.toString()
                : collectionsArray.value.toString()
          }
        });
      } else {
        void router.push({
          path: router.currentRoute.value.path,
          query: {
            search: search.value,
            'filter[tier]': tier.value,
            sort: sort.value.sort,
            order: sort.value.order,
            page: 1,
            limit: ItemsPerPage.value,
            market: market.value,
            status: status.value,
            collections:
              collections.value.length > 0
                ? collections.value.toString()
                : collectionsArray.value.toString()
          }
        });
      }
    }
    // if any change is detected in these values update gallery data
    watch([DataParams, ApiParams, Page, ItemsPerPage], () => {
      void getData();
    });
    watch([market], () => {
      void applyFilters();
    });
    watch(ApiParams, (newval, olval) => {
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
      applyFilters,
      updateTier,
      updateLimit,
      updatePage,
      search,
      tier,
      tierOptions,
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
      market
    };
  }
});
</script>

<template lang="pug">
page
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
            :class='$q.screen.lt.md ? "order-last" : ""'
          )
            q-input(
              dense,
              outlined,
              v-model='search',
              placeholder='Search',
              @update:model-value='() => { applyFilters(); }'
            )
              template(v-slot:prepend)
                q-icon(v-if='search === ""', name='search')
                q-icon.cursor-pointer(
                  v-else,
                  name='clear',
                  @click='() => { search = ""; applyFilters(); }'
                )
          .col-md-3.col-sm-6.col-xs-6
            q-select.filters-selection(
              outlined,
              dense,
              v-model='sort',
              :options='sortOptions',
              @update:model-value='() => { applyFilters(); }',
              color='primary'
            )
      // Filter for desktop view
      q-card-section
        .row.justify-evenly
          .col-lg-2.col-md-3.q-pt-md(v-if='showFilter')
            q-card.q-pb-md(bordered, flat)
              .q-pa-md
                q-btn-toggle(
                  v-model='market',
                  spread,
                  no-caps,
                  rounded,
                  unelevated,
                  toggle-color='primary',
                  color='white',
                  text-color='primary',
                  :options='[ { label: "Primary", value: "primary" }, { label: "Retail", value: "retail" }, ]'
                )
              q-expansion-item(
                expand-separator,
                icon='query_stats',
                label='Status',
                default-opened,
                v-if='filterStatus'
              )
                .row.q-col-gutter-sm.q-pa-md
                  .col-12
                    .row
                      .col-6 Buy Now
                      .col-6
                        q-radio.float-right.q-pl-md(
                          v-model='status',
                          val='buynow',
                          color='primary',
                          @update:model-value='() => { applyFilters(); }'
                        )
                  .col-12(v-if='market === "retail"')
                    .row
                      .col-6 On Auction
                      .col-6
                        q-radio.float-right.q-pl-md(
                          v-model='status',
                          val='auction',
                          color='primary',
                          @update:model-value='() => { applyFilters(); }'
                        )
              q-expansion-item(
                expand-separator,
                icon='diamond',
                label='Tier',
                v-if='filterTier'
              )
                .row.q-col-gutter-sm.q-pa-md
                  .col-12
                    .row
                      .col-6 Diamond
                      .col-6
                        q-radio.float-right.q-pl-md(
                          v-model='tier',
                          val='Diamond',
                          @update:model-value='(v) => { updateTier(v); }'
                        )
                  .col-12
                    .row
                      .col-6 Gold
                      .col-6
                        q-radio.float-right.q-pl-md(
                          v-model='tier',
                          val='Gold',
                          @update:model-value='(v) => { updateTier(v); }'
                        )
                  .col-12
                    .row
                      .col-6 Silver
                      .col-6
                        q-radio.float-right.q-pl-md(
                          v-model='tier',
                          val='Silver',
                          @update:model-value='(v) => { updateTier(v); }'
                        )
                  .col-12
                    .row
                      .col-6 Bronze
                      .col-6
                        q-radio.float-right.q-pl-md(
                          v-model='tier',
                          val='Bronze',
                          @update:model-value='(v) => { updateTier(v); }'
                        )
                  .col-12
                    .row
                      .col-6 All
                      .col-6
                        q-radio.float-right.q-pl-md(
                          v-model='tier',
                          val='All',
                          @update:model-value='(v) => { updateTier(v); }'
                        )

              q-expansion-item(
                expand-separator,
                icon='attach_money',
                label='Price',
                v-if='filterPrice'
              )
                q-range.q-pa-lg(
                  v-model='price',
                  :min='0',
                  :max='12000',
                  label,
                  @change='() => { applyFilters(); }'
                )
              q-expansion-item(
                expand-separator,
                icon='collections',
                label='Collection',
                v-if='filterCollection'
              )
                .row.q-col-gutter-sm.q-pa-md
                  .col-12(v-for='col in collectionsArray')
                    .row
                      .col-6 {{ col }}
                      .col-6
                        q-checkbox.float-right.q-pl-md(
                          v-model='collections',
                          :val='col',
                          color='primary',
                          @update:model-value='(value) => { applyFilters(); }'
                        )

          // Gallery section
          div(:class='showFilter ? "col-lg-10 col-md-9" : "col-12"')
            GalleryView(:data='GalleryData', :type='type')

          // Paging for Gallery section
          .col-12 
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
            q-btn.absolute-top-right(
              size='20px',
              flat,
              dense,
              round,
              icon='clear',
              v-close-popup,
              style='z-index: 1'
            )
            q-card-section
              q-expansion-item(
                expand-separator,
                icon='query_stats',
                label='Status',
                default-opened,
                v-if='filterStatus'
              )
                .row.q-col-gutter-sm.q-pa-md
                  .col-12
                    .row
                      .col-6 Buy Now
                      .col-6
                        q-checkbox.float-right.q-pl-md(
                          v-model='status',
                          val='buynow',
                          color='primary',
                          @update:model-value='() => { applyFilters(); }'
                        )
                  .col-12
                    .row
                      .col-6 On Auction
                      .col-6
                        q-checkbox.float-right.q-pl-md(
                          v-model='status',
                          val='auction',
                          color='primary',
                          @update:model-value='() => { applyFilters(); }'
                        )
              q-expansion-item(
                expand-separator,
                icon='diamond',
                label='Tier',
                v-if='filterTier'
              )
                .row.q-col-gutter-sm.q-pa-md
                  .col-12
                    .row
                      .col-6 Diamond
                      .col-6
                        q-radio.float-right.q-pl-md(
                          v-model='tier',
                          val='Diamond',
                          @update:model-value='(v) => { updateTier(v); }'
                        )
                  .col-12
                    .row
                      .col-6 Gold
                      .col-6
                        q-radio.float-right.q-pl-md(
                          v-model='tier',
                          val='Gold',
                          @update:model-value='(v) => { updateTier(v); }'
                        )
                  .col-12
                    .row
                      .col-6 Silver
                      .col-6
                        q-radio.float-right.q-pl-md(
                          v-model='tier',
                          val='Silver',
                          @update:model-value='(v) => { updateTier(v); }'
                        )
                  .col-12
                    .row
                      .col-6 Bronze
                      .col-6
                        q-radio.float-right.q-pl-md(
                          v-model='tier',
                          val='Bronze',
                          @update:model-value='(v) => { updateTier(v); }'
                        )
                  .col-12
                    .row
                      .col-6 All
                      .col-6
                        q-radio.float-right.q-pl-md(
                          v-model='tier',
                          val='All',
                          @update:model-value='(v) => { updateTier(v); }'
                        )

              q-expansion-item(
                expand-separator,
                icon='attach_money',
                label='Price',
                v-if='filterPrice'
              )
                q-range.q-pa-lg(
                  v-model='price',
                  :min='0',
                  :max='12000',
                  label,
                  @change='() => { applyFilters(); }'
                )
              q-expansion-item(
                expand-separator,
                icon='collections',
                label='Collection',
                v-if='filterCollection'
              )
                q-list(bordered, separator)
                  q-item(clickable, v-ripple)
                    q-item-section Collection 1
                    q-item-section All
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
