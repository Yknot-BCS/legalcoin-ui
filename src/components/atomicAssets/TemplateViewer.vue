<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import DetailsTable from 'src/components/atomicAssets/DetailsTable.vue';
import Description from 'src/components/atomicAssets/Description.vue';
import Timeline from 'src/components/atomicAssets/TimeLine.vue';
import { ITemplate } from 'atomicassets/build/API/Explorer/Objects';
import { ISale } from 'atomicmarket/build/API/Explorer/Objects';
import TemplateActionCard from 'src/components/atomicAssets/TemplateActionCard.vue';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default defineComponent({
  name: 'TemplateCardView',
  components: { DetailsTable, Description, Timeline, TemplateActionCard },
  props: {
    templateData: {
      type: Object as PropType<ITemplate>,
      required: true
    },
    saleData: {
      type: Object as PropType<ISale>,
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
      return `https://ipfs.io/ipfs/${<string>(
        this.templateData.immutable_data?.img
      )}`;
    }
  }
});
</script>

<template lang="pug">
//- Desktop view
.row.justify-center(v-if='$q.screen.gt.md')
  .col-12.page-view.q-py-lg.asset-container
    .row.q-pa-sm
      //- Image
      q-card.col-12.q-my-sm
        q-img.asset-img(
          :src='assetImg',
          placeholder-src='https://placeimg.com/500/300/nature'
        )

      //- Actions
      TemplateActionCard.col-12.q-my-sm(
        :templateData='templateData',
        :saleData='saleData',
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
            Description(
              :description='templateData?.immutable_data?.description'
            )
          q-tab-panel(name='details')
            DetailsTable(
              :data='templateData?.immutable_data',
              :schema='templateData?.schema'
            )
//- Mobile view
.row.justify-center(v-else)
  .col-12.page-view.q-py-lg.asset-container
    .row.q-pa-sm
      //- Image
      q-card.col-12.q-my-sm
        q-img.asset-img(
          :src='assetImg',
          placeholder-src='https://placeimg.com/500/300/nature'
        )

      //- Actions
      TemplateActionCard.col-12.q-my-sm(
        :templateData='templateData',
        :saleData='saleData',
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
            Description(
              :description='templateData?.immutable_data?.description'
            )
          q-tab-panel(name='details')
            DetailsTable(
              :data='templateData?.immutable_data',
              :schema='templateData?.schema'
            )
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
.asset-container
  width: 100%
  max-width: 30rem
</style>