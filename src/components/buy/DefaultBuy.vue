<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'src/store';
import GalleryView from 'src/components/gallery/GalleryView.vue';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default defineComponent({
  name: 'DeafaultBuy',
  components: { GalleryView },
  setup() {
    const store = useStore();
    const assets = computed(() => store.state.buy.assets);
    const collections = computed(() => store.state.buy.collections);
    const templates = computed(() => store.state.buy.templates);
    const filter = computed(() => store.state.buy.filter);
    return {
      assets,
      collections,
      templates,
      filter
    };
  }
});
</script>

<template lang="pug">
.row.q-px-md.q-py-lg
  .col-12(v-if="filter === 'All' || filter === 'Assets'")
    .row
      .col-12.q-pt-md
        .q-px-md.text-h6.text-grey-8.text-weight-bold.text-center Primary Retail Portal

      .col-12.q-pt-lg.q-px-sm
        .row
          .col-6.px
            .q-px-md.text-h6.text-grey-8 Assets
          .col-6
            q-btn.q-px-md.float-right.text-grey-8(label="view all" flat)
      q-seperator
      .col-12.q-px-sm
        GalleryView(:data="assets" type="asset" v-if="filter === 'All' || filter === 'Assets'")

  .col-12(v-if="filter === 'All' || filter === 'Collections'")
    .row
      .col-12.q-pt-lg.q-px-sm
        .row
          .col-6.px
            .q-px-md.text-h6.text-grey-8 Collections
          .col-6
            q-btn.q-px-md.float-right.text-grey-8(label="view all" flat)
      q-seperator
      .col-12.q-px-sm
        GalleryView(:data="collections" type="collection")
  .col-12(v-if="filter === 'All' || filter === 'Templates'")
    .row
      .col-12.q-pt-lg.q-px-sm
        .row
          .col-6.px
            .q-px-md.text-h6.text-grey-8 Templates
          .col-6
            q-btn.q-px-md.float-right.text-grey-8(label="view all" flat)
      .col-12.q-px-sm
        GalleryView(:data="templates" type="template")
</template>
