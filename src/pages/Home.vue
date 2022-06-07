<script lang="ts">
import { onMounted, computed } from 'vue';
import Cards from 'src/components/gallery/cards/index.vue';
import { useStore } from 'src/store';
export default {
  components: { Cards },
  setup() {
    const store = useStore();
    const assets = computed(() => store.state.buy.assets);
    onMounted(async () => {
      await store.dispatch('buy/updateAll');
    });
    return {
      assets
    };
  }
};
</script>

<template lang="pug">
q-page.q-py-md
  .row
    .col-6.row.justify-end.items-center.q-px-lg
      h2 Bringing the legal industry into the digital world
    .main-asset.col-6.q-pa-lg(v-if='assets.length > 0')
      Cards(:data='assets[0]', type='asset')
</template>

<style lang="sass" scoped>
h2
  max-width: 21ch
.main-asset
  flex-basis: 600px
</style>
