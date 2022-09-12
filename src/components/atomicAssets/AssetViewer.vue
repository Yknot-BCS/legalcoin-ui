<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import DetailsTable from 'src/components/atomicAssets/DetailsTable.vue';
import Description from 'src/components/atomicAssets/Description.vue';
import Timeline from 'src/components/atomicAssets/TimeLine.vue';
import {
  ISale,
  IBuyoffer,
  IMarketOffer,
  IMarketAsset,
  IAuction
} from 'atomicmarket/build/API/Explorer/Objects';
import AssetActionCard from 'src/components/atomicAssets/AssetActionCard.vue';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default defineComponent({
  name: 'Asset',
  components: { DetailsTable, Description, Timeline, AssetActionCard },
  emits: ['updateAssetInfo'],
  props: {
    assetData: {
      type: Object as PropType<IMarketAsset>,
      required: true
    },
    saleData: {
      type: Object as PropType<ISale>,
      required: false
    },
    buyofferData: {
      type: Object as PropType<IBuyoffer>,
      required: false
    },
    offerData: {
      type: Object as PropType<IMarketOffer>,
      required: false
    },
    aucData: {
      type: Object as PropType<IAuction[]>,
      required: false
    }
  },
  setup() {
    return {
      tab: ref('description')
    };
  },
  computed: {
    assetImg(): string {
      return `${process.env.IPFS_ENDPOINT}/ipfs/${<string>(
        this.assetData.data.img
      )}`;
    }
  }
});
</script>

<template lang="pug">
.row
  //- Mobile view
  .row.col-12.q-pt-xl.justify-center
    //- Image
    q-card.col-6.q-my-sm.q-mx-md(flat)
      q-img.asset-img(
        :src='assetImg',
        placeholder-src='~src/assets/LC-Placeholder.png'
      )
        template(v-slot:loading)
          .text-primary
            .q-pt-xl Loading...
            q-spinner

    //- Actions
    AssetActionCard.col-6.q-my-sm.q-mx-md(
      :assetData='assetData',
      :saleData='saleData',
      :buyofferData='buyofferData',
      :offerData='offerData',
      :aucData='aucData',
      @update-asset-info='$emit("updateAssetInfo", $event)'
    )

    //- Details and Description
  .row.col-12.q-pa-sm.justify-center
    q-card.col-6.q-my-sm.q-mx-md(flat)
      q-tabs.text-grey-8(
        v-model='tab',
        dense,
        align='left',
        active-color='primary',
        :breakpoint='0'
      )
        q-tab(name='description', label='Description')
        q-tab(name='details', label='Details')

      q-tab-panels(v-model='tab', animated)
        q-tab-panel(name='description')
          Description(:templateData='assetData.template')
        q-tab-panel(name='details')
          DetailsTable(:data='assetData?.data', :schema='assetData.schema')
    q-card.col-6.q-my-sm.q-mx-md(flat)
</template>

<style lang="sass" scoped>
.page-view
  width: 100%
  max-width: 1400px
// .page-background
//   background: #f0f0f0
.asset-img
  width: 100%
  height: 100%
// .container
//   border: 1px solid $grey-6
//   border-radius: 13px
.asset-container-desktop
  width: 100%
  max-width: 64rem
.asset-container-mobile
  width: 100%
  max-width: 30rem
</style>
