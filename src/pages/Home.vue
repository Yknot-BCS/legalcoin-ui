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
img.bg.tr.animated.fadeInLeft.slower(src='~assets/polygons/v1.svg')
img.bg-polygon.tr.animated.fadeInLeft.slower(src='~assets/polygons/v2.svg')
q-page.q-py-md
  .row
    .col-md-6.row.justify-end.items-center.q-px-lg
      h2.text-grey-1 Bringing the legal industry into the digital world
    .main-asset.col-md-6.q-pa-lg(v-if='assets.length > 0')
      Cards.rounded.shadow-10(:data='assets[0]', type='asset')
</template>

<style lang="sass" scoped>
h2
  max-width: 21ch
.main-asset
  flex-basis: 600px

.rounded
  border-radius: 1rem
  overflow: hidden

.bg
  position: absolute
  height: 100%
  left: 0rem
  z-index: -1
  &.tr
    right: 0rem
    top: 0rem
  &.br
    left: 0rem
    bottom: 0rem

.bg-polygon
  position: absolute
  left: 3rem
  bottom: 10rem
</style>
