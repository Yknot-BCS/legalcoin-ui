<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import { atomic_api, atomic_market_api } from 'src/api/atomic_assets';
import { IAsset } from 'atomicassets/build/API/Explorer/Objects';
import { ISale } from 'atomicmarket/build/API/Explorer/Objects';
import { useRoute } from 'vue-router';
import AssetCard from 'src/components/atomicAssets/AssetCard.vue';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default defineComponent({
  name: 'Asset',
  components: { AssetCard },
  setup() {
    //const data = await atomic_api.getAsset('1099511627786');
    const route = useRoute();
    const assetId = computed(() => route.params.asset);
    const assetData = ref<IAsset>(new Object({ data: { img: '' } }) as IAsset);
    async function getAssetData() {
      assetData.value = await atomic_api.getAsset(assetId.value as string);
    }

    const saleData = ref<ISale>(new Object({}) as ISale);

    let saleFilter = {
      asset_id: assetId.value,
      page: 1,
      order: 'desc',
      limit: 6,
      sort: 'created'
    } as unknown;
    async function getSaleData() {
      saleData.value = (await atomic_market_api.getSales(saleFilter))[0];
    }
    onMounted(async () => {
      void (await getAssetData());
      void (await getSaleData());
    });
    return {
      assetData,
      saleData
    };
  }
});
</script>

<template lang="pug">
AssetCard(:assetData='assetData', :saleData='saleData')
</template>

<style lang="sass" scoped></style>
