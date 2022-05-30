<script lang="ts">
import { defineComponent, onMounted, computed, ref } from 'vue';
import DefaultBuy from 'src/components/buy/DefaultBuy.vue';
import { useStore } from 'src/store';
//import { useRouter } from 'vue-router';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default defineComponent({
  name: 'Buy',
  components: { DefaultBuy },
  setup() {
    //const router = useRouter();
    const store = useStore();
    const filterModel = computed(() => store.state.buy.filter);
    const sort = computed(() => store.state.buy.sort);
    const sortModel = ref({
      label: 'Created (Newest)',
      value: 'created-desc',
      sort: 'created',
      order: 'desc'
    });
    const order = computed(() => store.state.buy.order);
    onMounted(async () => {
      await store.dispatch('buy/updateAll');
    });
    function filter(value: string) {
      void store.dispatch('buy/updateFilter', value);
    }
    function sorting(value: {
      label: string;
      value: string;
      sort: string;
      order: string;
      category: string;
    }) {
      void store.dispatch('buy/updateSorting', {
        sort: value.sort,
        order: value.order
      });
    }
    return {
      filterModel,
      sort,
      order,
      options: ['All', 'Collections', 'Templates', 'Assets'],
      filter,
      sorting,
      sortModel,
      group: ref<string>(null),
      sortOptions: computed(() => [
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
          order: 'asc',
          disable: !(filterModel.value == 'Assets')
        },
        {
          label: 'Mint (Lowest)',
          value: 'template_mint-desc',
          sort: 'template_mint',
          order: 'desc',
          disable: !(filterModel.value == 'Assets')
        }
      ])
    };
  }
});
</script>

<template lang="pug">
q-page
  .page-background
    .row.q-px-lg.q-py-lg
      .col-12
        .row.q-col-gutter-md.justify-center
          .col-lg-2
            q-select.filters-selection(outlined v-model="filterModel" :options="options" @update:model-value="filter" color="primary" )
          .col-lg-2
            q-select.filters-selection(outlined v-model="sortModel" :options="sortOptions" @update:model-value="sorting" color="primary" )
    DefaultBuy
</template>

<style lang="sass" scoped>
.page-background
  background: #f0f0f0
.filters-selection
  max-width: 180px
  min-width: 100px
</style>
