<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue';
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
    const model = computed(() => store.state.buy.filter);
    onMounted(async () => {
      await store.dispatch('buy/updateAll');
    });
    function filter(value: string) {
      void store.dispatch('buy/updateFilter', value);
    }
    return {
      model,
      options: ['All', 'Collections', 'Templates', 'Assets'],
      filter
    };
  }
});
</script>

<template lang="pug">
q-page.page-background
  .row.q-px-lg.q-py-lg.justify-center
    .col-lg-1.q-pt-md
      q-select(outlined v-model="model" :options="options" @update:model-value="filter" )
  DefaultBuy
</template>

<style lang="sass" scoped>
.page-background
  background: #f0f0f0
.dropdown
  width: 100%
  min-width: 140px
</style>
