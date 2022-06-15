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
  get_templates
} from 'src/api/atomic_assets';
import { AssetsApiParams } from 'atomicassets/build/API/Explorer/Params';
import { useRouter } from 'vue-router';

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
      required: false
    }
  },
  setup(props) {
    const router = useRouter();
    const $q = useQuasar();
    const GalleryData = ref<GalleryCard[]>([]);
    const showFilter = ref<boolean>(false);
    const showFilterDialog = ref<boolean>(false);
    const DataParams = computed(() => props.DataParams);
    const { ApiParams, Page, ItemsPerPage, Type } = toRefs(props);
    const page = ref(Page);
    const search =
      ref<string>((ApiParams.value as AssetsApiParams).search as string) ||
      ref('');
    const tier = ref<string>(
      DataParams.value.find((v) => v.key === 'tier')
        ? DataParams.value.find((v) => v.key === 'tier').value
        : 'All'
    );
    console.log(tier.value);

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
    function Filter() {
      if ($q.screen.lt.md) {
        showFilterDialog.value = !showFilterDialog.value;
      } else {
        showFilter.value = !showFilter.value;
      }
    }
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
        default:
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
    async function updateTier(val: string) {
      await router.push({
        path: router.currentRoute.value.path,
        query: {
          search: search.value,
          'filter[tier]': val,
          sort: sort.value.sort,
          page: Page.value,
          limit: limit.value,
          order: sort.value.order
        }
      });
    }
    function applyFilters() {
      void router.push({
        path: router.currentRoute.value.path,
        query: {
          search: search.value,
          'filter[tier]': tier.value,
          sort: sort.value.sort,
          order: sort.value.order,
          page: page.value,
          limit: ItemsPerPage.value
        }
      });
    }
    watch([DataParams, ApiParams, Page, ItemsPerPage], () => {
      void getData();
    });
    onMounted(async () => {
      void (await getData());
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
          .col-md-1.col-sm-6.col-xs-6
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
      q-card-section
        .row.justify-evenly
          .col-lg-2.col-md-3.q-pt-md(v-if='showFilter')
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
                      v-model='tier',
                      @update:model-value='(v) => { updateTier(v); }'
                    )

          div(:class='showFilter ? "col-lg-10 col-md-9" : "col-12"')
            GalleryView(:data='GalleryData', type='asset')
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
              .text-h5 Filters
            q-separator(inset)
            q-card-section
              .text-h6 Tier
              q-option-group(
                :options='tierOptions',
                type='radio',
                v-model='tier',
                @update:model-value='(v) => { updateTier(v); }'
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
