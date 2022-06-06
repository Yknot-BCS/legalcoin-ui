<script lang="ts">
import { defineComponent, ref } from 'vue';
import { atomic_api, atomic_market_api } from 'src/api/atomic_assets';
import { IAsset } from 'atomicassets/build/API/Explorer/Objects';
import { ISale, IBuyoffer } from 'atomicmarket/build/API/Explorer/Objects';
import AssetCard from 'src/components/atomicAssets/AssetCard.vue';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default defineComponent({
  name: 'Asset',
  components: { AssetCard },
  setup() {
    const assetData = ref<IAsset>(new Object({ data: { img: '' } }) as IAsset);
    const saleData = ref<ISale>(new Object({}) as ISale);
    const buyofferData = ref<IBuyoffer>(new Object({}) as IBuyoffer);

    return {
      assetData,
      saleData,
      buyofferData
    };
  },
  computed: {
    isLegalCoin() {
      // Check if the asset is from legalcoin
      if (
        this.assetData?.collection?.authorized_accounts[0] ===
        process.env.AA_ACCOUNT
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    async getAssetData() {
      this.assetData = await atomic_api.getAsset(
        this.$route.params.asset as string
      );
      console.log(this.assetData);
    },

    async getOfferData() {
      let offerFilter = {
        asset_id: this.$route.params.asset as string
      } as unknown;

      this.buyofferData = (
        await atomic_market_api.getBuyoffers(offerFilter)
      )[0];
      console.log(this.buyofferData);
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
      console.log(this.saleData);
    }
  },
  async mounted() {
    console.log('Asset mounted');
    // check if asset of template
    if (this.$route.params.asset) {
      console.log('Is Asset');
      await this.getAssetData();
      await this.getSaleData();
      await this.getOfferData();
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
.div(v-if='isLegalCoin')
  AssetCard(
    :assetData='assetData',
    :saleData='saleData',
    :buyofferData='buyofferData'
  )
q-page.row.fit.wrap.justify-center(v-else)
  q-card.warn-card.row.justify-center
    | This is not a LegalCoin asset
</template>

<style lang="sass" scoped>
.warn-card
  width: 100%
  max-width: 300px
  height: 100%
</style>
