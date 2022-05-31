<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import { atomic_api } from 'src/api/atomic_assets';
import { IAsset } from 'atomicassets/build/API/Explorer/Objects';
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
    onMounted(async () => {
      void (await getAssetData());
    });
    return {
      assetData,
      assetId
    };
  }
});
</script>

<template lang="pug">
AssetCard(:assetData='assetData')
</template>

<style lang="sass" scoped></style>
