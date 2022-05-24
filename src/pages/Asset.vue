<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import { atomic_api } from 'src/api/atomic_assets';
import { IAsset } from 'atomicassets/build/API/Explorer/Objects';
import { useRoute } from 'vue-router';
import DetailsTable from 'src/components/atomicAssets/DetailsTable.vue';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default defineComponent({
  name: 'Asset',
  components: { DetailsTable },
  setup() {
    //const data = await atomic_api.getAsset('1099511627786');
    const route = useRoute();
    const assetId = computed(() => route.params.asset);
    const assetData = ref<IAsset>(new Object({ data: { img: '' } }) as IAsset);
    async function getAssetData() {
      assetData.value = await atomic_api.getAsset(assetId.value as string);
    }
    onMounted(async () => {
      console.log(assetId.value);
      void (await getAssetData());
      console.log(assetId.value);
    });
    return {
      assetData,
      assetId,
      tab: ref('description')
    };
  }
});
</script>

<template lang="pug">
.row.justify-center
  .col-12.page-view
    .row.q-pa-md
      .col-12
        .text-subtitle2.q-pa-lg Gallery/asset/{{assetId}}
    .row.q-col-gutter-md.q-pa-md
      .col-xs-12.col-sm-6
        q-card.details-card
          q-img.asset-img(:src="assetData.data.img")
      .col-xs-12.col-sm-6
        q-card.details-card
          q-img.asset-img(:src="assetData.data.img")
      .col-xs-12.col-sm-6
        q-tabs(
            v-model="tab"
            dense
            align="left"
            active-color="primary"
            class="text-grey-8"
            :breakpoint="0"
          )
            q-tab(name="description" label="Description")
            q-tab(name="details" label="Details")

        q-tab-panels(v-model="tab" animated)
          q-tab-panel(name="description")
            q-card.details-card
              q-img.asset-img(:src="assetData.data.img")
          q-tab-panel(name="details")
            DetailsTable

</template>

<style lang="sass" scoped>
.page-view
  width: 100%
  max-width: 1400px
.asset-img
  width: 100%
  height: 675px
.details-card
  width: 100%
  height: 675px
</style>
