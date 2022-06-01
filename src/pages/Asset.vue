<script lang="ts">
import { defineComponent, ref } from 'vue';
import { atomic_api, atomic_market_api } from 'src/api/atomic_assets';
import { IAsset } from 'atomicassets/build/API/Explorer/Objects';
import { ISale } from 'atomicmarket/build/API/Explorer/Objects';
import AssetCard from 'src/components/atomicAssets/AssetCard.vue';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default defineComponent({
  name: 'Asset',
  components: { AssetCard },
  setup() {
    const assetData = ref<IAsset>(new Object({ data: { img: '' } }) as IAsset);
    const saleData = ref<ISale>(new Object({}) as ISale);

    return {
      assetData,
      saleData
    };
  },
  methods: {
    async getAssetData() {
      this.assetData = await atomic_api.getAsset(
        this.$route.params.asset as string
      );
    },

    async getSaleData() {
      let saleFilter = {
        asset_id:
          this.$route.params.asset === undefined
            ? ''
            : this.$route.params.asset,
        page: 1,
        order: 'asc',
        limit: 6,
        collection_name:
          this.$route.params.collection_name === undefined
            ? ''
            : (this.$route.params.collection_name as string),
        template_id:
          this.$route.params.template_id === undefined
            ? ''
            : this.$route.params.template_id,
        state: 1,
        seller:
          this.$route.query.seller === undefined ? '' : this.$route.query.seller
      } as unknown;
      this.saleData = (await atomic_market_api.getSales(saleFilter))[0];
    }
  },
  async mounted() {
    console.log('Asset mounted');
    // check if asset of template
    if (this.$route.params.asset) {
      console.log('Is Asset');
      await this.getAssetData();
      await this.getSaleData();
    }

    // TODO figure out how to handle templates
    if (this.$route.params.template) {
      console.log('Is Template');
      await this.getSaleData();
    }
  }
});
</script>

<template lang="pug">
AssetCard(:assetData='assetData', :saleData='saleData')
</template>

<style lang="sass" scoped></style>
