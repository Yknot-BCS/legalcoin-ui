<script lang="ts">
import { defineComponent, watch, ref, onMounted, toRefs, computed } from 'vue';
import {
  getCollectionsList,
  getQueryMarket,
  getQueryStatus,
  getQueryTier,
  getQueryPrice,
  getQueryCollections
} from 'src/api/atomic_assets';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  name: 'AssetFilter',
  props: {
    Search: {
      type: Boolean,
      required: false,
      default: true
    },
    Filter: {
      type: Boolean,
      required: false,
      default: true
    },
    Status: {
      type: Boolean,
      required: false,
      default: true
    },
    Price: {
      type: Boolean,
      required: false,
      default: true
    },
    Market: {
      type: Boolean,
      required: false,
      default: true
    },
    Collection: {
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
    const { Search, Filter, Status, Price, Market, Collection, Tier } =
      toRefs(props);
    console.log(Market.value);
    const market = ref(getQueryMarket());
    console.log(market.value);
    const status = ref(getQueryStatus());
    const tier = ref(getQueryTier());
    const collections = ref(getQueryCollections());
    const price = ref(getQueryPrice());
    const minPrice = ref(price.value.min || 0);
    const maxPrice = ref(price.value.max || 0);
    const tierOptions = ref([
      { label: 'Diamond', value: 'Diamond' },
      { label: 'Gold', value: 'Gold' },
      { label: 'Silver', value: 'Silver' },
      { label: 'Bronze', value: 'Bronze' },
      { label: 'All', value: 'All' }
    ]);
    const collectionsArray = ref<string[]>([]);

    const disablePriceFilter = computed(
      () =>
        !(minPrice.value > 0 || maxPrice.value > 0) ||
        minPrice.value >= maxPrice.value
    );

    // Apply filters to url query
    async function applyFilter(key: string, value: string) {
      let query = { ...route.query };
      query[key] = value;
      console.log(query);
      await router.push({
        path: router.currentRoute.value.path,
        query: query
      });
    }

    async function applyPriceFilter() {
      await applyFilter('min_price', minPrice.value.toString());
      await applyFilter('max_price', maxPrice.value.toString());
    }

    onMounted(() => {
      void getCollectionsList().then((collectionData) => {
        collectionsArray.value = collectionData.array;
      });
    });

    watch([tier], () => {
      void applyFilter('tier', tier.value);
    });

    watch([market], async () => {
      await applyFilter('market', market.value);
      status.value = 'buynow';
      await applyFilter('status', 'buynow');
    });

    return {
      applyFilter,
      tierOptions,
      market,
      collections,
      status,
      tier,
      minPrice,
      maxPrice,
      showStatus: Status,
      showPrice: Price,
      showCollection: Collection,
      showTier: Tier,
      showSearch: Search,
      showMarket: Market,
      showFilter: Filter,
      collectionsArray,
      disablePriceFilter,
      applyPriceFilter
    };
  }
});
</script>

<template lang="pug">
.q-pa-md(v-if='showMarket')
  q-btn-toggle(
    v-model='market',
    spread,
    no-caps,
    rounded,
    unelevated,
    toggle-color='primary',
    color='white',
    text-color='primary',
    :options='[ { label: " Legalcoin market", value: "legalcoin" }, { label: "Open Market", value: "open" }, ]'
  )
q-expansion-item(
  expand-separator,
  icon='query_stats',
  label='Status',
  default-opened,
  v-if='showStatus'
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
            @update:model-value='(val) => { applyFilter("status", val); }'
          )
    .col-12(v-if='market === "open"')
      .row
        .col-6 On Auction
        .col-6
          q-radio.float-right.q-pl-md(
            v-model='status',
            val='auction',
            color='primary',
            @update:model-value='(val) => { applyFilter("status", val); }'
          )
q-expansion-item(
  expand-separator,
  icon='diamond',
  label='Tier',
  v-if='showTier'
)
  .row.q-col-gutter-sm.q-pa-md
    .col-12
      .row
        .col-6 Diamond
        .col-6
          q-radio.float-right.q-pl-md(v-model='tier', val='Diamond')
    .col-12
      .row
        .col-6 Gold
        .col-6
          q-radio.float-right.q-pl-md(v-model='tier', val='Gold')
    .col-12
      .row
        .col-6 Silver
        .col-6
          q-radio.float-right.q-pl-md(v-model='tier', val='Silver')
    .col-12
      .row
        .col-6 Bronze
        .col-6
          q-radio.float-right.q-pl-md(v-model='tier', val='Bronze')
    .col-12
      .row
        .col-6 All
        .col-6
          q-radio.float-right.q-pl-md(v-model='tier', val='All')

q-expansion-item(
  expand-separator,
  icon='attach_money',
  label='Price',
  v-if='showPrice && market === "open"'
)
  .row.q-py-md.q-px-sm.full-height.items-center
    .col-3.text-bold LEGAL
    .col-4
      q-input(outlined, dense, v-model='minPrice', type='number', label='Min')
    .col-1.text-center.text-bold to
    .col-4
      q-input(outlined, dense, v-model='maxPrice', type='number', label='Max')
  .row.q-px-sm.q-pb-md.full-height.items-center
    q-btn.full-width(
      unelevated,
      :disable='disablePriceFilter',
      color='primary',
      label='Apply',
      @click='applyPriceFilter()'
    )
q-expansion-item(
  expand-separator,
  icon='collections',
  label='Collection',
  v-if='showCollection'
)
  .row.q-col-gutter-sm.q-pa-md
    .col-12(v-for='col in collectionsArray')
      .row.items-center.full-height
        .col-6 {{ col }}
        .col-6
          q-checkbox.float-right.q-pl-md(
            v-model='collections',
            :val='col',
            color='primary',
            @update:model-value='(val) => { applyFilter("collections", val.length > 0 ? val.toString() : collectionsArray.toString()); }'
          )
</template>

<style scoped lang="sass"></style>
