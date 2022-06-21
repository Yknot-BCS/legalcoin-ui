<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import DetailsTable from 'src/components/atomicAssets/DetailsTable.vue';
import Description from 'src/components/atomicAssets/Description.vue';
import Timeline from 'src/components/atomicAssets/TimeLine.vue';
import {
  ISale,
  IBuyoffer,
  IMarketOffer,
  IMarketAsset
} from 'atomicmarket/build/API/Explorer/Objects';
import AssetActionCard from 'src/components/atomicAssets/AssetActionCard.vue';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default defineComponent({
  name: 'Asset',
  components: { DetailsTable, Description, Timeline, AssetActionCard },
  props: {
    assetData: {
      type: Object as PropType<IMarketAsset>,
      required: true
    },
    saleData: {
      type: Object as PropType<ISale>,
      required: true
    },
    buyofferData: {
      type: Object as PropType<IBuyoffer>,
      required: true
    },
    offerData: {
      type: Object as PropType<IMarketOffer>,
      required: true
    }
  },
  setup() {
    return {
      tab: ref('description')
    };
  },
  computed: {
    assetImg(): string {
      return `https://ipfs.io/ipfs/${<string>this.assetData.data.img}`;
    }
  }
});
</script>

<template lang="pug">
//- Desktop view
.row.justify-center(v-if='$q.screen.gt.sm')
  .col-12.page-view.q-py-lg.asset-container-desktop
    .row.q-pa-sm
      //- Image
      q-card.col-12.q-my-sm
        //- TODO replace with placeholder
        q-img.asset-img(
          :src='assetImg',
          placeholder-src='https://placeimg.com/500/300/nature'
        )
      //- Actions
      AssetActionCard.col-12.q-my-sm.q-ml-sm(
        :assetData='assetData',
        :saleData='saleData',
        :buyofferData='buyofferData',
        :offerData='offerData',
        @update-asset-info='$emit("updateAssetInfo", $event)'
      )
      //- Details and Description
      q-card.col-12.q-my-sm
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
            Description(:description='assetData.data.description')
          q-tab-panel(name='details')
            DetailsTable(:data='assetData?.data', :schema='assetData.schema')

//- Mobile view
.row.justify-center(v-else)
  .col-12.page-view.q-py-lg.asset-container-mobile
    .row.q-pa-sm
      //- Image
      q-card.col-12.q-my-sm
        q-img.asset-img(
          :src='assetImg',
          placeholder-src='https://placeimg.com/500/300/nature'
        )

      //- Actions
      AssetActionCard.col-12.q-my-sm(
        :assetData='assetData',
        :saleData='saleData',
        :buyofferData='buyofferData',
        :offerData='offerData',
        @update-asset-info='$emit("updateAssetInfo", $event)'
      )

      //- Details and Description
      q-card.col-12.q-my-sm
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
            Description(:description='assetData?.data?.description')
          q-tab-panel(name='details')
            DetailsTable(:data='assetData?.data', :schema='assetData.schema')
</template>

<style lang="sass" scoped>
.page-view
  width: 100%
  max-width: 1400px
// .page-background
//   background: #f0f0f0
// .asset-img
//   width: 100%
//   height: 675px
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
