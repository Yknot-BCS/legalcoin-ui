<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { atomic_market_api } from 'src/api/atomic_assets';
import {
  ISale,
  IBuyoffer,
  IMarketOffer,
  IMarketAsset,
  IAuction
} from 'atomicmarket/build/API/Explorer/Objects';
import AssetViewer from 'src/components/atomicAssets/AssetViewer.vue';
import { useStore } from 'src/store';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default defineComponent({
  name: 'Asset',
  components: { AssetViewer },
  emits: ['updateAssetInfo'],
  setup() {
    const assetData = ref<IMarketAsset>(
      new Object({ data: { img: '' } }) as IMarketAsset
    );
    const saleData = ref<ISale>(new Object({}) as ISale);
    const buyofferData = ref<IBuyoffer>(new Object({}) as IBuyoffer);
    const offerData = ref<IMarketOffer>(new Object({}) as IMarketOffer);
    const aucData = ref<IAuction[]>(new Object({}) as IAuction[]);
    const store = useStore();
    const accountName = computed(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      () => store.getters['account/getAccountName'] as string
    );
    console.log(accountName);

    return {
      accountName,
      assetData,
      saleData,
      buyofferData,
      offerData,
      aucData
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
      this.assetData = await atomic_market_api.getAsset(
        this.$route.params.asset as string
      );
      console.log(this.assetData);
    },

    async getBuyOfferData() {
      let offerFilter = {
        asset_id: this.$route.params.asset as string,
        state: 0
      } as unknown;

      this.buyofferData = (
        await atomic_market_api.getBuyoffers(offerFilter)
      )[0];
      console.log('buyofferData', this.buyofferData);
    },

    async getOfferData() {
      let offerFilter = {
        recipient: this.accountName,
        state: 0,
        asset_id: this.$route.params.asset as string
      } as unknown;

      this.offerData = (await atomic_market_api.getOffers(offerFilter))[0];
      console.log('offerData', this.offerData);
    },

    async getSaleData() {
      let saleFilter = {
        asset_id:
          this.$route.params.asset === undefined
            ? ''
            : this.$route.params.asset,
        page: 1,
        order: 'asc',
        limit: 100,
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
      console.log('saleData', this.saleData);
    },

    async getAucData() {
      // Don't get cancelled auctions
      let aucFilter = {
        state: '1',
        asset_id:
          this.$route.params.asset === undefined
            ? ''
            : this.$route.params.asset,
        page: 1,
        order: 'desc',
        sort: 'auction_id',
        limit: 100
      } as unknown;
      let response = await atomic_market_api.getAuctions(aucFilter);
      if (response.length > 0) {
        this.aucData = response;
      } else {
        aucFilter = {
          participant: this.accountName,
          asset_id:
            this.$route.params.asset === undefined
              ? ''
              : this.$route.params.asset,
          page: 1,
          order: 'desc',
          sort: 'auction_id',
          limit: 100
        } as unknown;
        this.aucData = await atomic_market_api.getAuctions(aucFilter);
      }

      console.log('aucData', this.aucData);
    },

    async updateAssetInfo() {
      await this.getAssetData();
      await this.getSaleData();
      await this.getBuyOfferData();
      await this.getOfferData();
      await this.getAucData();
    }
  },
  async mounted() {
    console.log('Asset mounted');
    // check if asset of template
    if (this.$route.params.asset) {
      console.log('Is Asset');
      await this.updateAssetInfo();
    }
  }
});
</script>

<template lang="pug">
.div.q-py-xl(v-if='isLegalCoin')
  AssetViewer(
    :assetData='assetData',
    :saleData='saleData',
    :buyofferData='buyofferData',
    :offerData='offerData',
    :aucData='aucData',
    @update-asset-info='updateAssetInfo()'
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
