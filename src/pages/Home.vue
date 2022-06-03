<script lang="ts">
import { defineComponent, onMounted, computed, ref } from 'vue';
import SingleGalleryView from 'src/components/gallery/SingleGalleryView.vue';
import { useStore } from 'src/store';
export default {
  components: { SingleGalleryView },
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
      SingleGalleryView(:data='[assets[0]]', type='asset')
</template>

<style lang="sass" scoped>
h2
  max-width: 21ch
.main-asset
  flex-basis: 600px
</style>
